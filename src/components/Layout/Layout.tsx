import React from 'react'

// PageContainer Component
interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
  fullHeight?: boolean
}

const maxWidthMap = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-8xl',
  full: 'max-w-full',
}

export function PageContainer({
  children,
  maxWidth = 'lg',
  className = '',
  fullHeight = false,
}: PageContainerProps) {
  return (
    <div
      className={`
        mx-auto px-4 sm:px-6 lg:px-8
        ${maxWidthMap[maxWidth]}
        ${fullHeight ? 'min-h-screen' : 'py-8 md:py-12'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Grid Component
interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const gapMap = {
  sm: 'gap-2 md:gap-4',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
}

export function Grid({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}: GridProps) {
  return (
    <div className={`grid ${colsMap[cols]} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  )
}

// Section Component
interface SectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  id?: string
}

export function Section({
  children,
  title,
  subtitle,
  className = '',
  id,
}: SectionProps) {
  return (
    <section id={id} className={`py-8 md:py-12 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8 md:mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gaming-secondary text-lg">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

// Flex Component
interface FlexProps {
  children: React.ReactNode
  direction?: 'row' | 'col'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  align?: 'start' | 'center' | 'end' | 'stretch'
  gap?: 'sm' | 'md' | 'lg'
  wrap?: boolean
  className?: string
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const gapFlexMap = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
}

export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'center',
  gap = 'md',
  wrap = false,
  className = '',
}: FlexProps) {
  return (
    <div
      className={`
        flex
        ${direction === 'row' ? 'flex-row' : 'flex-col'}
        ${justifyMap[justify]}
        ${alignMap[align]}
        ${gapFlexMap[gap]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Stack Component (vertical flex)
interface StackProps {
  children: React.ReactNode
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
}

export function Stack({
  children,
  gap = 'md',
  align = 'stretch',
  className = '',
}: StackProps) {
  return (
    <Flex
      direction="col"
      gap={gap}
      align={align}
      className={className}
    >
      {children}
    </Flex>
  )
}

// Card Component
interface CardProps {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  hover?: boolean
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  padding = 'md',
  className = '',
  onClick,
  hover = true,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl border border-gaming-accent/20
        bg-gaming-card/50 backdrop-blur-sm
        ${paddingMap[padding]}
        ${hover ? 'hover:border-gaming-accent/50 hover:shadow-glow transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Divider Component
interface DividerProps {
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
}

export function Divider({ variant = 'solid', className = '' }: DividerProps) {
  const variantMap = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  return (
    <div
      className={`
        border-t border-gaming-accent/20
        ${variantMap[variant]}
        ${className}
      `}
    />
  )
}
