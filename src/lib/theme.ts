/**
 * Theme configuration for consistent UI styling across the application
 */
export const theme = {
  // Card styling variations
  card: {
    container: 'bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg',
    header: 'p-4 border-b border-zinc-700',
    body: 'p-6',
    footer: 'p-4 border-t border-zinc-700 bg-zinc-800/50',
  },

  // Button styling variations
  button: {
    primary: 'px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-medium rounded-md transition-colors',
    secondary: 'px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium rounded-md transition-colors',
    outline:
      'px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium rounded-md transition-colors',
  },

  // Section styling
  section: {
    container: 'mb-12',
    title: 'text-xl font-semibold text-zinc-200 mb-6 flex items-center',
  },

  // Icon styling
  icon: {
    container: 'inline-flex p-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg mr-3',
    base: 'text-zinc-900',
  },
}
