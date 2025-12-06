import React from 'react';

export function Pagination({ children }: { children: React.ReactNode }) {
  return <nav aria-label="pagination" className="flex items-center justify-center">{children}</nav>;
}

export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <ul className="flex items-center gap-2">{children}</ul>;
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <li className="list-none">{children}</li>;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive?: boolean;
};

export function PaginationLink({ isActive, className = '', ...props }: LinkProps) {
  const base = 'px-3 py-1 rounded border text-sm';
  const active = isActive ? ' bg-[#4ECDC4] text-white border-[#4ECDC4]' : ' bg-white text-gray-700';
  return <a {...props} className={`${base} ${active} ${className}`} />;
}

export function PaginationPrevious(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={`px-3 py-1 rounded border text-sm bg-white text-gray-700 ${props.className ?? ''}`}>Prev</a>;
}

export function PaginationNext(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={`px-3 py-1 rounded border text-sm bg-white text-gray-700 ${props.className ?? ''}`}>Next</a>;
}

export function PaginationEllipsis() {
  return <span className="px-2 text-gray-500">…</span>;
}
