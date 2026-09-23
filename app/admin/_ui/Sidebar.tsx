import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar'
import { HugeiconsIcon } from "@hugeicons/react"
import { ChartNoAxesCombinedIcon, ChartLineData01Icon, UserMultiple03Icon, PieChartIcon, HashtagIcon, ArrowLeftRightIcon, Clock9, TaskDaily01Icon, CrownIcon, Activity03Icon, Calendar01Icon, Undo03Icon, SettingsIcon } from "@hugeicons/core-free-icons"

const SidebarApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='flex min-h-dvh w-full'>
                <SidebarProvider>
                    <Sidebar>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={ChartNoAxesCombinedIcon} strokeWidth={2} />
                                                <span>Dashboard</span>
                                            </SidebarMenuButton>
                                            <SidebarMenuBadge className='bg-primary/10 top-1/2! right-2 -translate-y-1/2! rounded-full'>
                                                5
                                            </SidebarMenuBadge>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            <SidebarGroup>
                                <SidebarGroupLabel>Pages</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={ChartLineData01Icon} strokeWidth={2} />
                                                <span>Content Performance</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={UserMultiple03Icon} strokeWidth={2} />
                                                <span>Audience Insight</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
                                                <span>Engagement Metrics</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={HashtagIcon} strokeWidth={2} />
                                                <span>Hashtag Performance</span>
                                            </SidebarMenuButton>
                                            <SidebarMenuBadge className='bg-primary/10 top-1/2! right-2 -translate-y-1/2! rounded-full'>
                                                3
                                            </SidebarMenuBadge>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={ArrowLeftRightIcon} strokeWidth={2} />
                                                <span>Competitor Analysis</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={Clock9} strokeWidth={2} />
                                                <span>Campaign Tracking</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={2} />
                                                <span>Sentiment Tracking</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={CrownIcon} strokeWidth={2} />
                                                <span>Influencer</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            <SidebarGroup>
                                <SidebarGroupLabel>Supporting Features</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={Activity03Icon} strokeWidth={2} />
                                                <span>Real Time Monitoring</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />
                                                <span>Schedule Post & Calendar</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={Undo03Icon} strokeWidth={2} />
                                                <span>Report & Export</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
                                                <span>Settings & Integrations</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton render={<a href='#' />}>
                                                <HugeiconsIcon icon={UserMultiple03Icon} strokeWidth={2} />
                                                <span>User Management</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <div className='flex flex-1 flex-col'>
                        <header className='bg-card sticky top-0 z-50 flex h-13.75 items-center justify-between gap-6 border-b px-4 py-2 sm:px-6'>
                            <SidebarTrigger className='[&_svg]:size-5!' />
                        </header>
                        <main className='size-full flex-1 px-4 py-6 sm:px-6'>
                            {/* <Card className='h-250'> */}
                            {/* <CardContent className='h-full'> */}
                            {children}
                            {/* </CardContent> */}
                            {/* </Card> */}
                        </main>
                        {/* <footer className='bg-card h-10 border-t px-4 sm:px-6'>
                        </footer> */}
                    </div>
                </SidebarProvider>
            </div>
        </>
    )
}

export default SidebarApp