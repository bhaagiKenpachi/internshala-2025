import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Artist type for browseArtists (no fee field)
export interface Artist {
    id: number;
    name: string;
    category: string;
    location: string;
    price: string;
    status: string;
    submittedAt: string;
    bio?: string;
    languages?: string[];
    imageUrl?: string;
    acceptedAt?: string;
    acceptedBy?: string;
    notes?: string;
}

// ArtistSubmission type for submittedArtists (includes fee field)
export interface ArtistSubmission {
    id: number;
    name: string;
    category: string;
    location: string;
    fee: string;
    status: string;
    submittedAt: string;
    bio?: string;
    languages?: string[];
    imageUrl?: string;
}

export interface ArtistsState {
    browseArtists: Artist[];
    submittedArtists: ArtistSubmission[];
    loading: boolean;
    error: string | null;
    filters: {
        category: string;
        location: string;
        priceRange: string;
    };
}

// Initial state
const initialState: ArtistsState = {
    browseArtists: [],
    submittedArtists: [],
    loading: false,
    error: null,
    filters: {
        category: "All",
        location: "All",
        priceRange: "All"
    },
};

// Async thunk to load browse artists
export const loadBrowseArtists = createAsyncThunk(
    'artists/loadBrowseArtists',
    async () => {
        const response = await import('@/data/artists.json');
        // Add status Approved to all static artists
        const staticArtists = response.default.map((artist: any, idx: number) => ({
            ...artist,
            id: artist.id || Date.now() + idx,
            status: 'Approved',
            submittedAt: '',
        }));

        // Load locally stored accepted artists
        const localBrowse = JSON.parse(localStorage.getItem('browseArtists') || '[]');

        // Merge static artists with locally stored accepted artists
        // Use a Map to avoid duplicates by ID
        const artistMap = new Map();

        // Add static artists first
        staticArtists.forEach(artist => {
            artistMap.set(artist.id, artist);
        });

        // Add locally stored accepted artists (these will override static artists with same ID)
        localBrowse.forEach((artist: Artist) => {
            artistMap.set(artist.id, artist);
        });

        return Array.from(artistMap.values());
    }
);

// Async thunk to load submitted artists
export const loadSubmittedArtists = createAsyncThunk(
    'artists/loadSubmittedArtists',
    async () => {
        const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
        const staticData = await import('@/data/submittedArtists.json');
        const allSubmitted = [...localStorageData, ...staticData.default];

        // Get accepted artists from localStorage to filter them out
        const acceptedArtists = JSON.parse(localStorage.getItem('browseArtists') || '[]');
        const acceptedIds = new Set(acceptedArtists.map((artist: Artist) => artist.id));

        // Filter out artists that are already accepted and in browseArtists
        return allSubmitted.filter(artist => !acceptedIds.has(artist.id));
    }
);

// Async thunk to submit new artist
export const submitArtist = createAsyncThunk(
    'artists/submitArtist',
    async (artistData: Omit<ArtistSubmission, 'id' | 'status' | 'submittedAt'>) => {
        const newSubmission: ArtistSubmission = {
            ...artistData,
            id: Date.now(),
            status: "Pending",
            submittedAt: new Date().toISOString().split('T')[0],
        };
        const existingSubmissions = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
        const updatedSubmissions = [newSubmission, ...existingSubmissions];
        localStorage.setItem('artistSubmissions', JSON.stringify(updatedSubmissions));
        return newSubmission;
    }
);

// Artists slice
const artistsSlice = createSlice({
    name: 'artists',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<ArtistsState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        updateArtistStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
            const { id, status } = action.payload;
            const artist = state.submittedArtists.find(a => a.id === id);
            if (artist) {
                artist.status = status;
                const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
                const updatedLocalStorageData = localStorageData.map((artist: ArtistSubmission) =>
                    artist.id === id ? { ...artist, status } : artist
                );
                localStorage.setItem('artistSubmissions', JSON.stringify(updatedLocalStorageData));
            }
        },
        acceptArtistSubmission: (state, action: PayloadAction<{ artist: ArtistSubmission; notes?: string; acceptedBy: string }>) => {
            const { artist, notes, acceptedBy } = action.payload;
            state.submittedArtists = state.submittedArtists.filter(a => a.id !== artist.id);
            const acceptedArtist: Artist = {
                id: artist.id,
                name: artist.name,
                category: artist.category,
                location: artist.location,
                status: 'Approved',
                submittedAt: artist.submittedAt,
                bio: artist.bio,
                languages: artist.languages,
                imageUrl: artist.imageUrl,
                acceptedAt: new Date().toISOString().split('T')[0],
                acceptedBy,
                notes,
                price: artist.fee,
            };
            state.browseArtists.unshift(acceptedArtist);
            // Save to localStorage (browseArtists)
            const existingBrowse = JSON.parse(localStorage.getItem('browseArtists') || '[]');
            const updatedBrowse = [acceptedArtist, ...existingBrowse];
            localStorage.setItem('browseArtists', JSON.stringify(updatedBrowse));
            // Remove from localStorage (submitted)
            const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
            const updatedLocalStorageData = localStorageData.filter((a: ArtistSubmission) => a.id !== artist.id);
            localStorage.setItem('artistSubmissions', JSON.stringify(updatedLocalStorageData));
        },
        rejectArtistSubmission: (state, action: PayloadAction<{ id: number }>) => {
            const { id } = action.payload;
            const submittedArtist = state.submittedArtists.find(a => a.id === id);
            if (submittedArtist) {
                submittedArtist.status = 'Rejected';
            }
            const localStorageData = JSON.parse(localStorage.getItem('artistSubmissions') || '[]');
            const updatedLocalStorageData = localStorageData.map((artist: ArtistSubmission) =>
                artist.id === id ? { ...artist, status: 'Rejected' } : artist
            );
            localStorage.setItem('artistSubmissions', JSON.stringify(updatedLocalStorageData));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Load browse artists
            .addCase(loadBrowseArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadBrowseArtists.fulfilled, (state, action) => {
                state.loading = false;
                state.browseArtists = action.payload;
            })
            .addCase(loadBrowseArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load artists';
            })
            // Load submitted artists
            .addCase(loadSubmittedArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadSubmittedArtists.fulfilled, (state, action) => {
                state.loading = false;
                state.submittedArtists = action.payload;
            })
            .addCase(loadSubmittedArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load submitted artists';
            })
            // Submit artist
            .addCase(submitArtist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitArtist.fulfilled, (state, action) => {
                state.loading = false;
                state.submittedArtists.unshift(action.payload);
            })
            .addCase(submitArtist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to submit artist';
            });
    },
});

export const {
    setFilters,
    updateArtistStatus,
    acceptArtistSubmission,
    rejectArtistSubmission,
    clearError,
} = artistsSlice.actions;
export default artistsSlice.reducer;

function safeString(val: unknown): string {
    return typeof val === 'string' ? val : val !== undefined && val !== null ? String(val) : '';
} 