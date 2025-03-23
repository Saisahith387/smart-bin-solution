
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                eco: {
                    '50': '#f2f9f6',
                    '100': '#e6f3ed',
                    '200': '#cde7db',
                    '300': '#a5d1be',
                    '400': '#77b59c',
                    '500': '#549a7f',
                    '600': '#3c7d65',
                    '700': '#2e6350',
                    '800': '#275041',
                    '900': '#224238',
                    '950': '#11241e',
                },
                full: '#e74c3c',
                half: '#f39c12',
                empty: '#2ecc71',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'fade-in': {
                    '0%': { 
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': { 
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fade-out': {
                    '0%': { 
                        opacity: '1',
                        transform: 'translateY(0)' 
                    },
                    '100%': { 
                        opacity: '0',
                        transform: 'translateY(-10px)' 
                    }
                },
                'pulse-gentle': {
                    '0%, 100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        opacity: '0.85',
                        transform: 'scale(0.98)'
                    }
                },
                'float': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-10px)'
                    }
                },
                'ripple': {
                    '0%': {
                        transform: 'scale(0)',
                        opacity: '1'
                    },
                    '100%': {
                        transform: 'scale(2.5)',
                        opacity: '0'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.6s ease-out forwards',
                'fade-out': 'fade-out 0.5s ease-out forwards',
                'pulse-gentle': 'pulse-gentle 3s infinite ease-in-out',
                'float': 'float 6s infinite ease-in-out',
                'ripple': 'ripple 1.5s linear infinite'
			},
            fontFamily: {
                sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['SF Pro Display', 'Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['SF Mono', 'ui-monospace', 'monospace']
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glass-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                'glass-xl': '0 20px 50px -12px rgba(0, 0, 0, 0.05)'
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
