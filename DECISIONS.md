# Technical Decisions

## Drag & Drop Library: @dnd-kit

**Why we chose it:**

1. **Modern & Active Development**: Regularly updated with good community support
2. **Accessibility**: Built-in keyboard and screen reader support out of the box
3. **Performance**: Minimal re-renders, efficient drag operations
4. **TypeScript**: Excellent TypeScript support with proper type definitions
5. **Modular**: Can use only the parts we need (core, sortable, utilities)

**Alternatives considered:**

-   **react-beautiful-dnd**: Good but has a larger bundle size and less active maintenance
-   **react-dnd**: More complex setup, better for highly custom drag interactions
-   **SortableJS**: Not React-native, would require wrapper components

**Our implementation:**

-   Used `@dnd-kit/core` for basic drag & drop
-   Implemented optimistic updates for smooth UX
-   Added visual feedback during drag operations
-   Ensured responsive behavior across devices

## State Management: Zustand

**Why Zustand:**

1. **Minimal Boilerplate**: Much simpler than Redux or Context with providers
2. **Performance**: No unnecessary re-renders, stores are independent
3. **DevTools**: Built-in debugging capabilities
4. **Middleware**: Easy to add logging, persistence, or other middleware
5. **TypeScript**: Excellent TypeScript experience with minimal setup

## URL Persistence Strategy

**Why store filters in URL:**

1. **Shareable State**: Users can share links with pre-applied filters
2. **Browser Navigation**: Back/forward buttons work as expected
3. **State Recovery**: Page refresh preserves filter settings
4. **Bookmarkable**: Specific views can be bookmarked

**Implementation details:**

-   Filters are serialized to URL query parameters
-   On page load, filters are read from URL
-   URL updates without page reload using `history.pushState`

## API Design

**Why Next.js API Routes:**

1. **Unified Framework**: Same framework for frontend and backend
2. **Type Safety**: Can share types between frontend and backend
3. **Development Speed**: Easy to set up and test
4. **Production Ready**: Built-in optimizations and best practices
