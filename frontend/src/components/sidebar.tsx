"use client"

import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { BoxSelect } from 'lucide-react'

import { BlogCategory, useAppData } from '@/context/AppContext'

const SideBar = () => {

    const {searchQuery,setSearchQuery,setCategory} = useAppData();
  return <Sidebar>
    <SidebarHeader className='bg-white text-2xl font-bold mt-5'>
        The Reading Retreat
    </SidebarHeader>
    <SidebarContent className='bg-white'>
        <SidebarGroup>
            <SidebarGroupLabel>
                Search
            </SidebarGroupLabel>
            <input  type='text' value={searchQuery} onChange={(e)=>{
                setSearchQuery(e.target.value)
            }} placeholder='Search your desired blog'/>
             <SidebarGroupLabel>
                Category
            </SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={()=>setCategory("")}>
                        <BoxSelect/>
                        <span>All</span>
                    </SidebarMenuButton>
                    {
                        BlogCategory?.map((e,i)=>{
                            return (
                             <SidebarMenuButton key={i} onClick={()=>setCategory(e)}>
                        <BoxSelect/>
                        <span>{e}</span>
                    </SidebarMenuButton>  );
                        })
                    }
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>

    </SidebarContent>
  </Sidebar>
}

export default SideBar