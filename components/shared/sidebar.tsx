'use client';

import Link from 'next/link';
import { LogOut, Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import Logo from './logo';
import { Button } from '../ui/button';
import { Accordion } from '../ui/accordion';
import { NavbarItem } from './navbar-item';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';
import { Skeleton } from '../ui/skeleton';
import { useWorkspaceStore } from '@/store/workspaceStore';
import useWorkspaces from '@/hooks/useWorkspace';

interface SidebarProps {
  storageKey?: string;
}

const Sidebar = ({ storageKey = 't-sidebar-state' }: SidebarProps) => {
  const { logOut } = useAuth();
  const { getMyWorkspacesQuery } = useWorkspaces();
  const isSuccessWorkspace = getMyWorkspacesQuery.isSuccess;
  const workspaces = getMyWorkspacesQuery?.data?.data;

  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='px-3 py-10 flex-1 bg-primary md:rounded-r-lg'>
          <div className='flex items-center justify-between mb-6 lg:mb-14 '>
            <div className=''>
              <Logo />
            </div>
            <Button
              className='p'
              asChild
              type='button'
              size='icon'
              variant='ghost'
            >
              <Link href='/create-workspace'>
                <Plus className='h-6 w-6' />
              </Link>
            </Button>
          </div>
          <div className='flex flex-col justify-between h-[75dvh] pt-2'>
            <Accordion
              type='multiple'
              defaultValue={defaultAccordionValue}
              className='space-y-2'
            >
              {isSuccessWorkspace ? (
                workspaces?.map((workspace) => (
                  <NavbarItem
                    key={workspace.id}
                    workspace={workspace}
                    onExpand={onExpand}
                    isExpanded={expanded[workspace.id]}
                    isActive={activeWorkspace?.id === workspace.id} // Pass isActive prop
                  />
                ))
              ) : (
                <>
                  <div className='flex items-center justify-between mb-2'>
                    <Skeleton className='h-10 w-[50%] bg-neutral-800/10' />
                    <Skeleton className='h-10 w-10 bg-neutral-800/10' />
                  </div>
                  <div className='space-y-2'>
                    <NavbarItem.Skeleton />
                    <NavbarItem.Skeleton />
                    <NavbarItem.Skeleton />
                  </div>
                </>
              )}
            </Accordion>
            <div className='space-y-2'>
              <Button
                variant={'ghost'}
                onClick={logOut}
                className='text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition text-white bg-none hover:bg-white/10 items-center'
              >
                <LogOut className={cn('h-5 w-5 mr-3 text-xl')} />
                <span className='flex items-center flex-1 text-lg lg:text-xl'>
                  Logout
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
