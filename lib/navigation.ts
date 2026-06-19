import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Headphones,
  Music,
  Ban,
  ClipboardList,
  Search,
  Users,
  Shuffle,
  BookOpen,
  Mic2,
  AlertCircle,
  DollarSign,
  FileText,
  BarChart3,
  User,
  KeyRound,
  Pencil,
} from 'lucide-react'

export type NavBlockId = 'dashboard' | 'fonogramas' | 'obras' | 'minha-area' | 'financeiro'

export type NavNode = {
  label: string
  href?: string
  icon?: LucideIcon
  description?: string
  external?: boolean
  children?: NavNode[]
  hub?: boolean
}

export type NavBlock = {
  id: NavBlockId
  label: string
  href: string
  icon: LucideIcon
  description: string
  accent: string
  hub?: boolean
  children?: NavNode[]
}

const fonogramasTools: NavNode[] = [
  {
    label: 'Cadastrar Fonograma',
    href: '/fonogramas/cadastro',
    icon: ClipboardList,
    description: 'Cadastrar e gerenciar fonogramas',
  },
  {
    label: 'Consultar Fonogramas',
    href: '/fonogramas/consulta',
    icon: Search,
    description: 'Consultar fonogramas cadastrados',
  },
  {
    label: 'Retido',
    href: '/fonogramas/retido',
    icon: Ban,
    description: 'Consultar valores retidos',
  },
  {
    label: 'Coletivo',
    href: '/fonogramas/coletivo',
    icon: Users,
    description: 'Gerenciar coletivos musicais',
  },
  {
    label: 'Pout-Pourrit',
    href: '/fonogramas/pout-pourrit',
    icon: Shuffle,
    description: 'Gerenciar pout-pourrits',
  },
]

const obrasTools: NavNode[] = [
  {
    label: 'Cadastrar Obra',
    href: '/obras/cadastro',
    icon: ClipboardList,
    description: 'Cadastrar e gerenciar obras musicais',
  },
  {
    label: 'Consultar Obras',
    href: '/obras/consulta',
    icon: Search,
    description: 'Consultar obras musicais no repertório',
  },
  {
    label: 'Retido',
    href: '/obras/retido',
    icon: Ban,
    description: 'Consultar valores retidos',
  },
  {
    label: 'Coletivo',
    href: '/obras/coletivo',
    icon: Users,
    description: 'Gerenciar coletivos musicais',
  },
  {
    label: 'Pout-Pourrit',
    href: '/obras/pout-pourrit',
    icon: Shuffle,
    description: 'Gerenciar pout-pourrits',
  },
]

export const navigationBlocks: NavBlock[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do seu repertório, gráficos e estatísticas',
    accent: 'brand',
  },
  {
    id: 'fonogramas',
    label: 'Fonogramas',
    href: '/fonogramas',
    icon: Headphones,
    description: 'Cadastro, consulta e relatórios de fonogramas',
    accent: 'violet',
    hub: true,
    children: fonogramasTools,
  },
  {
    id: 'obras',
    label: 'Obras',
    href: '/obras',
    icon: Music,
    description: 'Cadastro, consulta e pesquisa de obras musicais',
    accent: 'amber',
    hub: true,
    children: obrasTools,
  },
  {
    id: 'minha-area',
    label: 'Minha Área',
    href: '/minha-area',
    icon: User,
    description: 'Seu repertório pessoal e ocorrências',
    accent: 'blue',
    hub: true,
    children: [
      {
        label: 'Minhas Obras',
        href: '/minha-area/obras',
        icon: BookOpen,
        description: 'Obras vinculadas ao seu cadastro',
      },
      {
        label: 'Meus Fonogramas',
        href: '/minha-area/fonogramas',
        icon: Mic2,
        description: 'Fonogramas vinculados ao seu cadastro',
      },
      {
        label: 'Minhas Ocorrências',
        href: '/minha-area/ocorrencias',
        icon: AlertCircle,
        description: 'Ocorrências do seu repertório',
      },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    href: '/financeiro',
    icon: DollarSign,
    description: 'Demonstrativos e resumo financeiro',
    accent: 'emerald',
    hub: true,
    children: [
      {
        label: 'Demonstrativos ECAD',
        href: '/financeiro/ecad/demonstrativos',
        icon: FileText,
        description: 'Demonstrativos de distribuição ECAD',
      },
      {
        label: 'Demonstrativo SOCINPRO',
        href: '/financeiro/socinpro/demonstrativo',
        icon: FileText,
        description: 'Pagamentos e demonstrativos SOCINPRO',
      },
      {
        label: 'Resumo financeiro',
        href: '/financeiro/socinpro/resumo',
        icon: BarChart3,
        description: 'Mútuo, saldo e impostos',
      },
    ],
  },
]

/** @deprecated Use navigationBlocks */
export const navigationTree: NavNode[] = navigationBlocks.map((block) => ({
  label: block.label,
  href: block.href,
  icon: block.icon,
  description: block.description,
  hub: block.hub,
  children: block.children,
}))

export const profileNav: NavNode[] = [
  {
    label: 'Dados Cadastrais',
    href: '/perfil/dados-cadastrais',
    icon: User,
    description: 'Visualizar seus dados de titular',
  },
  {
    label: 'Alterar Senha',
    href: '/perfil/alterar-senha',
    icon: KeyRound,
    description: 'Atualizar senha de acesso',
  },
  {
    label: 'Nome de Exibição',
    href: '/perfil/nome-exibicao',
    icon: Pencil,
    description: 'Alterar nome exibido no portal',
  },
]

const profileHub: NavNode = {
  label: 'Perfil',
  href: '/perfil',
  icon: User,
  hub: true,
  description: 'Configurações da sua conta',
  children: profileNav,
}

export const externalLinks = [
  { label: 'ECAD', href: 'https://www3.ecad.org.br/' },
  { label: 'CISAC', href: 'https://www.cisac.org/' },
  { label: 'FILAIE', href: 'http://www.filaie.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/socinpro' },
  { label: 'Instagram', href: 'https://www.instagram.com/socinpro/' },
]

const segmentLabels: Record<string, string> = {
  inicio: 'Início',
  dashboard: 'Dashboard',
  fonogramas: 'Fonogramas',
  obras: 'Obras',
  cadastro: 'Cadastro',
  consulta: 'Consulta',
  retido: 'Retido',
  coletivo: 'Coletivo',
  'pout-pourrit': 'Pout-Pourrit',
  'minha-area': 'Minha Área',
  fonogramas_area: 'Meus Fonogramas',
  ocorrencias: 'Minhas Ocorrências',
  financeiro: 'Financeiro',
  ecad: 'ECAD',
  socinpro: 'SOCINPRO',
  demonstrativos: 'Demonstrativos',
  demonstrativo: 'Demonstrativo',
  resumo: 'Resumo Financeiro',
  perfil: 'Perfil',
  'dados-cadastrais': 'Dados Cadastrais',
  'alterar-senha': 'Alterar Senha',
  'nome-exibicao': 'Nome de Exibição',
  nova: 'Nova',
}

export function getSegmentLabel(segment: string, pathname?: string): string {
  if (segment === 'obras' && pathname?.startsWith('/minha-area')) {
    return 'Minhas Obras'
  }
  if (segment === 'fonogramas' && pathname?.startsWith('/minha-area')) {
    return 'Meus Fonogramas'
  }
  return segmentLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
}

function normalizePath(path: string): string {
  return path.replace(/\/$/, '') || '/inicio'
}

function isPathInBlock(pathname: string, block: NavBlock): boolean {
  const normalized = normalizePath(pathname)
  if (normalized === block.href) return true
  if (block.id === 'dashboard') return normalized === '/dashboard'
  if (block.id === 'minha-area') return normalized.startsWith('/minha-area')
  if (block.id === 'financeiro') return normalized.startsWith('/financeiro')
  if (block.id === 'fonogramas') return normalized.startsWith('/fonogramas')
  if (block.id === 'obras') return normalized.startsWith('/obras')
  return false
}

export function getActiveBlock(pathname: string): NavBlock | undefined {
  const normalized = normalizePath(pathname)
  if (normalized === '/inicio' || normalized === '/') return undefined
  return navigationBlocks.find((block) => isPathInBlock(normalized, block))
}

export function getBlockById(id: NavBlockId): NavBlock | undefined {
  return navigationBlocks.find((block) => block.id === id)
}

export function getBlockChildren(blockId: NavBlockId): NavNode[] {
  return getBlockById(blockId)?.children ?? []
}

function findNodeByPath(path: string, nodes: NavNode[]): NavNode | undefined {
  for (const node of nodes) {
    if (node.href === path) return node
    if (node.children) {
      const found = findNodeByPath(path, node.children)
      if (found) return found
    }
  }
  return undefined
}

function findInBlocks(path: string): NavNode | NavBlock | undefined {
  if (path === '/perfil') return profileHub
  if (path === '/inicio') {
    return { label: 'Início', href: '/inicio', description: 'Hub principal do portal' }
  }

  for (const block of navigationBlocks) {
    if (block.href === path) return block
    if (block.children) {
      const found = findNodeByPath(path, block.children)
      if (found) return found
    }
  }
  return findNodeByPath(path, profileNav)
}

/** Retorna href se for destino válido de navegação (hub ou página registrada). */
function getResolvableNavHref(href: string): string | undefined {
  const normalized = normalizePath(href)

  if (normalized === '/inicio') return normalized

  const block = navigationBlocks.find((b) => b.href === normalized)
  if (block) return normalized

  if (normalized === '/perfil') return normalized

  const node = findInBlocks(normalized)
  if (node && 'href' in node && node.href === normalized) return normalized

  return undefined
}

export function findNodeForHref(href: string): NavNode | NavBlock | undefined {
  return findInBlocks(normalizePath(href))
}

export function getHubChildren(pathname: string): NavNode[] {
  const normalized = normalizePath(pathname)
  const block = navigationBlocks.find((b) => b.href === normalized)
  if (block?.children?.length) return block.children

  const node = findNodeForHref(normalized)
  if (node && 'children' in node && node.children?.length) return node.children
  return []
}

export function resolveBreadcrumbHref(segments: string[], index: number): string {
  for (let i = index; i >= 0; i--) {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const resolved = getResolvableNavHref(href)
    if (resolved) return resolved
  }
  return '/inicio'
}

export function isHubRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname)
  if (normalized === '/perfil') return true
  const block = navigationBlocks.find((b) => b.href === normalized)
  if (block?.hub && block.children?.length) return true
  const node = findNodeForHref(normalized)
  return Boolean(node && 'hub' in node && node.hub && 'children' in node && node.children?.length)
}

export const sidebarSections: NavNode[] = navigationTree
