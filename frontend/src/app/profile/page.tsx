"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

import Cookies from "js-cookie";
import { Bubbles, Instagram, Linkedin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";


const Profile = () => {
     const { user, setUser, logoutUser} = useAppData();
    //  console.log(user);
    if(!user) return redirect("/login");
const InputRef = useRef<HTMLInputElement>(null)
const [loading, setLoading] = useState(false)

const [open,setOpen] =useState(false); const [formData,setFormData] = useState({
    name:user?.name || "",
    instagram:user?.instagram || "",
    linkedIn:user?.linkedin || "",
    bio:user?.bio || "",
})
const router = useRouter();

 const clickHandler = () => {
    InputRef.current?.click();
  };

  const changeHandler = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post(
          `${user_service}/api/v1/user/update/profilePic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data.message);
        setLoading(false);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/blogs",
        });
        setUser(data.user);
      } catch (error) {
        toast.error("Image Update Failed");
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async()=>{
    try {
        const token = Cookies.get("token")
        const {data} = await axios.post(`${user_service}/api/v1/user/update`,formData,{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        });
        toast.success("Profile Updated Successfully");
         setLoading(false);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/blogs",
        });
        setUser(data.user);
        setOpen(false);
    } catch (error) {
        toast.error(" Update Failed");
        setLoading(false);
    }
  }

 

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6 ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
          <CardContent className="flex flex-col items-center space-y-4"><div>
           
             <Avatar onClick={clickHandler}  className="w-20 h-20 bo border-gray-200 shadow-md cursor-pointer">
              
              <AvatarImage src={user?.image} alt="profilePic"></AvatarImage>
              <input type="file" className="hidden" accept="image/*" ref={InputRef} onChange={changeHandler}/>
            
            </Avatar>
          </div>
           
        
            <div className="w-full space-y-2 text-center">
                <label className="font-medium ">Name</label>{
                    <p>{user?.name}</p>
                }
            </div>

            {
                user?.bio && (
                    <div className="w-full space-y-2 text-center">
                <label className="font-medium">Bio:</label>{
                    <p>{user?.bio}</p>
                }
            </div>
                )
            }
<div className="flex gap-4 mt-3">
    {
        user?.instagram && <a href={user.instagram} target="blank" rel="noopener noreferrer">
            <Instagram className="text-pink-500 text-2xl" />
        </a>
        
    }
     {
        user?.linkedin && <a href={user.linkedin} target="blank" rel="noopener noreferrer">
            <Linkedin className="text-blue-500 text-2xl" />
        </a>
        
    }
    
</div>
<div className="flex flex-col sm:flex-row gap-2 mt-3 w-full justify-center">
    <Button onClick={()=>logoutUser()}>Logout</Button>
    <Button onClick={()=> router.push("/blog/new")}>Add Blog</Button>

    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
            <Button variant={"outline"}>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <div>
                    <Label className="mb-2" >Name</Label>
                    <Input
                    value={formData.name}
                    onChange={(e)=> setFormData({...formData,name:e.target.value})} />
                </div>
                  <div>
                    <Label className="mb-1">Bio</Label>
                    <Input
                    value={formData.bio}
                    onChange={(e)=> setFormData({...formData,bio:e.target.value})} />
                </div>
                  <div>
                    <Label className="mb-1">Instagram</Label>
                    <Input
                    value={formData.instagram}
                    onChange={(e)=> setFormData({...formData,instagram:e.target.value})} />
                </div>
                  <div>
                    <Label className="mb-1">LinkedIn</Label>
                    <Input
                    value={formData.
                        linkedIn}
                    onChange={(e)=> setFormData({...formData,linkedIn:e.target.value})} />
                </div>
               
                <Button  onClick={handleFormSubmit} className="w-full mt-4">Save Changes</Button>
            </div>
        </DialogContent>
    </Dialog>
</div>


          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Profile;
