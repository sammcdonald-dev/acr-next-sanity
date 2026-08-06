'use client';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '@/components/ui/Sheet';
import { getLinkByLinkObject } from '@/lib/links';
import { cn } from '@/lib/utils';
import type { SettingsQueryResult } from '@/sanity.types';
import { Button } from '../ui/Button';

const navLinkStyle =
  'inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-navy hover:bg-offwhite hover:text-coral transition-colors';

export default function NavBar({
  menuItems,
}: {
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-end flex-1 gap-2">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item._key}>
                {item.childMenu ? (
                  <>
                    <NavigationMenuTrigger
                      className={cn(navLinkStyle, 'bg-transparent')}
                    >
                      {item.text}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-1 w-[200px]">
                        {item.childMenu.map((child) => (
                          <NavigationMenuLink key={child._key} asChild>
                            <Link
                              href={
                                child.link
                                  ? getLinkByLinkObject(child.link) || '#'
                                  : '#'
                              }
                              className="block p-2 rounded-md hover:bg-offwhite hover:text-coral"
                              {...(child.link?.openInNewTab
                                ? {
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                  }
                                : {})}
                            >
                              {child.text}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={
                        item.link ? getLinkByLinkObject(item.link) || '#' : '#'
                      }
                      className={cn(navLinkStyle, 'cursor-pointer')}
                      {...(item.link?.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.text}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Button asChild size="sm" className="ml-2">
          <Link href="/register">Register</Link>
        </Button>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-4/5">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="px-4 py-6 flex flex-col gap-1">
            {menuItems.map((item) => (
              <div key={item._key}>
                {item.childMenu ? (
                  <>
                    <div className="py-2 px-4 font-display font-semibold text-navy">
                      {item.text}
                    </div>
                    <div className="pl-4">
                      {item.childMenu.map((child) => (
                        <SheetClose key={child._key} asChild>
                          <Link
                            href={
                              child.link
                                ? getLinkByLinkObject(child.link) || '#'
                                : '#'
                            }
                            className="block py-2 px-4 rounded-md hover:bg-offwhite hover:text-coral"
                            {...(child.link?.openInNewTab
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {child.text}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href={
                        item.link ? getLinkByLinkObject(item.link) || '#' : '#'
                      }
                      className="block py-2 px-4 rounded-md font-medium text-navy hover:bg-offwhite hover:text-coral"
                      {...(item.link?.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.text}
                    </Link>
                  </SheetClose>
                )}
              </div>
            ))}
            <SheetClose asChild>
              <Button asChild className="mt-4">
                <Link href="/register">Register</Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
        <button
          type="button"
          className="md:hidden flex items-center justify-center size-10 rounded-full text-navy hover:bg-offwhite transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MenuIcon className="size-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </Sheet>
    </div>
  );
}
