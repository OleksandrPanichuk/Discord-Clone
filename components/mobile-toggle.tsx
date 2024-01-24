import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NavigationSidebar } from './navigation/navigation-sidebar'
import { ServerSidebar } from './server/server-sidebar'
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet'

export const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
	  <Sheet >
	    <SheetTrigger asChild>
	      <Button variant={'ghost'} size={'icon'} className="md:hidden">
	        <Menu />
	      </Button>
	    </SheetTrigger>
	    <SheetContent side={'left'} className="p-0 gap-0 flex  ">
	      <div className="w-[72px]">
	        <NavigationSidebar />
	      </div>
	      <ServerSidebar  serverId={serverId} />
	    </SheetContent>
	  </Sheet>
	)
}
