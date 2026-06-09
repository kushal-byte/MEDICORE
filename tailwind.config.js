/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070f',
        navy: { 900: '#0a0f24', 800: '#0d142e', 700: '#111a3c', 600: '#16224f' },
        brand: { 400: '#5b8cff', 500: '#3b6dff', 600: '#274de0' },
        glass: 'rgba(255,255,255,0.05)'
      },
      backgroundImage: {
        'glow': 'radial-gradient(1200px 600px at 80% -10%, rgba(59,109,255,0.25), transparent 60%), radial-gradient(900px 500px at -10% 20%, rgba(43,77,224,0.18), transparent 55%)'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        glow: '0 0 0 1px rgba(91,140,255,0.25), 0 12px 40px rgba(59,109,255,0.25)'
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
