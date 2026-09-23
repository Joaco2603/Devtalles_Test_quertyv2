import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { HugeiconsIcon } from "@hugeicons/react"
import { User02Icon, SettingsIcon, CreditCardIcon, Notification01Icon, LogoutIcon } from "@hugeicons/core-free-icons"

const listItems = [
  {
    icon: (
      <HugeiconsIcon icon={User02Icon} strokeWidth={2} />
    ),
    property: 'Profile'
  },
  {
    icon: (
      <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
    ),
    property: 'Settings'
  },
  {
    icon: (
      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
    ),
    property: 'Billing'
  },
  {
    icon: (
      <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
    ),
    property: 'Notifications'
  },
  {
    icon: (
      <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
    ),
    property: 'Sign Out'
  }
]

const DropdownMenuUserMenuDemo = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='ghost' size='icon' className='rounded-full'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' alt='Hallie Richards' />
              <AvatarFallback className='text-xs'>HR</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          {listItems.map((item, index) => (
            <DropdownMenuItem key={index} className='*:[svg]:text-muted-foreground'>
              {item.icon}
              <span className='text-popover-foreground'>{item.property}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuUserMenuDemo
