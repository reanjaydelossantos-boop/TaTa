@import "tailwindcss";

@layer base {
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
    width: 100%;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Hide scrollbars globally for seamless mobile feel */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
