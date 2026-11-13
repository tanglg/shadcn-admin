import { type SVGProps } from 'react'

type BrandPreview = {
  background: string
  surface: string
  primary: string
  secondary: string
  text: string
  muted: string
}

export const IconThemeGardenFresh = createBrandThemeIcon('garden-fresh', {
  background: '#f4f7ef',
  surface: '#ffffff',
  primary: '#245a3a',
  secondary: '#d97719',
  text: '#10351f',
  muted: '#6b7c68',
})

function createBrandThemeIcon(id: string, palette: BrandPreview) {
  function BrandThemeIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        data-name={`icon-theme-${id}`}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 79.86 51.14'
        {...props}
      >
        <rect
          x={0.53}
          y={0.5}
          width={78.83}
          height={50.14}
          rx={3.5}
          fill={palette.background}
          stroke={palette.muted}
          strokeOpacity={0.3}
        />
        <rect
          x={5}
          y={5}
          width={6}
          height={6}
          rx={1.5}
          fill={palette.primary}
        />
        <rect
          x={14}
          y={6.5}
          width={23}
          height={3}
          rx={1.5}
          fill={palette.text}
        />
        <rect
          x={58}
          y={5}
          width={16}
          height={6}
          rx={2}
          fill={palette.primary}
        />
        <rect
          x={5}
          y={16}
          width={20}
          height={29}
          rx={2}
          fill={palette.surface}
          stroke={palette.muted}
          strokeOpacity={0.25}
        />
        <rect
          x={8}
          y={20}
          width={14}
          height={3}
          rx={1.5}
          fill={palette.primary}
        />
        <rect x={8} y={27} width={11} height={2} rx={1} fill={palette.muted} />
        <rect x={8} y={32} width={13} height={2} rx={1} fill={palette.muted} />
        <rect x={8} y={37} width={9} height={2} rx={1} fill={palette.muted} />
        <rect
          x={30}
          y={16}
          width={44}
          height={12}
          rx={2}
          fill={palette.surface}
          stroke={palette.muted}
          strokeOpacity={0.25}
        />
        <rect
          x={34}
          y={20}
          width={16}
          height={3}
          rx={1.5}
          fill={palette.text}
        />
        <rect
          x={58}
          y={20}
          width={12}
          height={3}
          rx={1.5}
          fill={palette.secondary}
        />
        <rect
          x={30}
          y={32}
          width={44}
          height={13}
          rx={2}
          fill={palette.surface}
          stroke={palette.muted}
          strokeOpacity={0.25}
        />
        <rect
          x={34}
          y={38}
          width={3}
          height={4}
          rx={0.5}
          fill={palette.primary}
          opacity={0.5}
        />
        <rect
          x={39}
          y={35}
          width={3}
          height={7}
          rx={0.5}
          fill={palette.primary}
          opacity={0.65}
        />
        <rect
          x={44}
          y={37}
          width={3}
          height={5}
          rx={0.5}
          fill={palette.primary}
        />
        <rect x={54} y={35} width={16} height={2} rx={1} fill={palette.text} />
        <rect
          x={54}
          y={40}
          width={12}
          height={2}
          rx={1}
          fill={palette.secondary}
        />
      </svg>
    )
  }

  return BrandThemeIcon
}

export const IconThemeHomeUI = createBrandThemeIcon('homeui', {
  background: '#f9fafb',
  surface: '#ffffff',
  primary: '#3f75ff',
  secondary: '#57aeff',
  text: '#1a1a1a',
  muted: '#737373',
})

export const IconThemeSchemaBlue = createBrandThemeIcon('schemablue', {
  background: '#f0f4ff',
  surface: '#ffffff',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  text: '#1e293b',
  muted: '#64748b',
})

export const IconThemeMistral = createBrandThemeIcon('mistral', {
  background: '#fff8e0',
  surface: '#fffaeb',
  primary: '#fa520f',
  secondary: '#ffd06a',
  text: '#1f1f1f',
  muted: '#6a6a6a',
})

export const IconThemeSupabase = createBrandThemeIcon('supabase', {
  background: '#ffffff',
  surface: '#f3f4f4',
  primary: '#3fcf8e',
  secondary: '#097c4f',
  text: '#000000',
  muted: '#808080',
})

export const IconThemeNoirLuxe = createBrandThemeIcon('noirluxe', {
  background: '#0c0c0e',
  surface: '#161618',
  primary: '#c9a84c',
  secondary: '#e6cd85',
  text: '#f2f0eb',
  muted: '#b3aca0',
})

export const IconThemeSoftro = createBrandThemeIcon('softro', {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#7c3aed',
  secondary: '#06b6d4',
  text: '#111827',
  muted: '#6b7280',
})

export const IconThemeDuolingo = createBrandThemeIcon('duolingo', {
  background: '#ffffff',
  surface: '#f7f7f7',
  primary: '#58cc02',
  secondary: '#1cb0f6',
  text: '#4b4b4b',
  muted: '#777777',
})

export const IconThemeCloudflare = createBrandThemeIcon('cloudflare', {
  background: '#151414',
  surface: '#1f1f1f',
  primary: '#ff5e1f',
  secondary: '#ff9910',
  text: '#ffffff',
  muted: '#9a9390',
})

export const IconThemeHubSpot = createBrandThemeIcon('hubspot', {
  background: '#f8f5ee',
  surface: '#ffffff',
  primary: '#ff4800',
  secondary: '#124548',
  text: '#1f1f1f',
  muted: '#6f6763',
})

export const IconThemeCanva = createBrandThemeIcon('canva', {
  background: '#ffffff',
  surface: '#f3f4f7',
  primary: '#8b3dff',
  secondary: '#00d9d9',
  text: '#0f1015',
  muted: '#394660',
})

export const IconThemeStripe = createBrandThemeIcon('stripe', {
  background: '#f6f9fc',
  surface: '#ffffff',
  primary: '#635bff',
  secondary: '#00d4aa',
  text: '#0a2540',
  muted: '#425466',
})

export const IconThemeSkylearn = createBrandThemeIcon('skylearn', {
  background: '#ffffff',
  surface: '#f8fafc',
  primary: '#3b82f6',
  secondary: '#fbbf24',
  text: '#0f172a',
  muted: '#475569',
})

export const IconThemeQuestUI = createBrandThemeIcon('questui', {
  background: '#1a0f0a',
  surface: '#2c1a10',
  primary: '#ca8a04',
  secondary: '#581c87',
  text: '#f5e6d3',
  muted: '#bfa98a',
})
