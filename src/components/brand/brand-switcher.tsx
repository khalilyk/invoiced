import { ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useOrgContext } from '@/contexts/org-context'

type Props = {
  onCreateNew: () => void
}

export function BrandSwitcher({ onCreateNew }: Props) {
  const { orgs, activeOrg, setActiveOrg } = useOrgContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-2 font-medium">
          <span className="flex items-center gap-2 truncate">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{activeOrg?.name ?? 'Select brand'}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Brands</DropdownMenuLabel>
        {orgs.map(org => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setActiveOrg(org)}
            className={activeOrg?.id === org.id ? 'font-medium' : ''}
          >
            <Building2 className="mr-2 size-4 text-muted-foreground" />
            {org.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onCreateNew}>
          <Plus className="mr-2 size-4" />
          New brand
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
