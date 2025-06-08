"use client"

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowEditStopReasons } from '@mui/x-data-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../redux';
import { toast } from 'react-toastify';

interface CsvFile {
  id: number;
  fileName: string;
  originalName: string;
  uploadedAt: string;
}

interface CsvRow {
  id: number;
  csvFileId: number;
  rowData: Record<string, string>;
  rowIndex: number;
}

const CsvEditorPage: React.FC = () => {
  const [csvFiles, setCsvFiles] = useState<CsvFile[]>([]);
  const router = useRouter();
  const user = useAppSelector((state: any) => {
    return state.auth?.user
  });
  const fetchFiles = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL +'/api/csv/files', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCsvFiles(res.data.files);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

const handleDelete = async (fileId: any) => {

  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/csv/${fileId}`, {
    headers: { Authorization: `Bearer ${user?.token}` },
    });
    toast.success("FIle deleted successfully")
    fetchFiles()
  } catch (err: any) {
    toast.error(err?.response?.data?.message)
  }
};

  useEffect(() => {
    if(user?.token){
      fetchFiles();
    }
  }, [user]);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Uploaded CSV Files</h2>
          {csvFiles?.length ? (<>
          <span className='text-[14px]'>Click to View and Edit</span>
          <div className="flex gap-2 flex-wrap flex-col">
            <div className='flex justify-around'>
            <span className='text-xl font-semibold mb-2'>Name</span>
            <span className='text-xl font-semibold mb-2'>Time</span>
            <span className='text-xl font-semibold mb-2'>Action</span>
            </div>
            {csvFiles.map((file) => (
              <Card
                key={file.id}
                onClick={()=>router.push(`/home/uploads/${file?.id}`)}
              >
                 <CardContent>
                  <div className='flex justify-around cursor-pointer'>
                    <span className='truncate max-w-[150px] block' title={file?.originalName} >{file?.originalName}</span>
                    <span className='truncate max-w-[200px] block' title={file?.uploadedAt}>{file?.uploadedAt}</span>
                    <Button className='cursor-pointer'
                    onClick={(e)=>{
                      e.stopPropagation()
                      handleDelete(file?.id)
                    }}
                    >Delete</Button>
                  </div>

                
                 </CardContent>
              </Card>
            ))}
          </div>
          </>):(<>
          <span >No File Found</span>
          </>)}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default CsvEditorPage;
