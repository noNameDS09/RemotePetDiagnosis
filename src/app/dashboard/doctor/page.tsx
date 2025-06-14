'use client';

import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { CalendarToday, Pets, Email } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface Appointment {
  pet_name: string;
  date: string;
}

interface CheckedPet {
  pet_name: string;
  session_date: string;
  report: string;
}

export default function DoctorDashboardPage() {
  const [doctor, setDoctor] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [checkedPets, setCheckedPets] = useState<CheckedPet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard/doctor');
        const data = await res.json();

        if (res.ok) {
          setDoctor(data.doctor);

          // Upcoming appointments: future sessions
          const upcoming = (data.sessions || []).filter(
            (s: any) => new Date(s.date) > new Date()
          );
          setAppointments(
            upcoming.map((s: any) => ({
              pet_name: s.Pet?.name || 'Unknown',
              date: s.date,
            }))
          );

          // Previously checked pets: past sessions
          
          const past = (data.sessions || []).filter(
            (s: any) => new Date(s.date) <= new Date()
          );
          setCheckedPets(
            past.map((s: any) => ({
              pet_name: s.Pet?.name || 'Unknown',
              session_date: s.date,
              report: s.report,
            }))
          );
        } 
      } catch (err) {
        // console.log('Error fetching doctor dashboard:', err);
        toast({
        title: "Login Error",
        description: "Could not fetch the details. Please try again.",
        variant: "destructive",
      });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)] text-xl">
        You must be&nbsp;
        <button className='text-blue-400' onClick={()=>router.push('/login')}>logged</button>
        &nbsp;in as a doctor to view this page.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-white h-[calc(screen-4rem)] p-8">
      <div className="w-full max-w-5xl pt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Typography variant="h4" className="text-gray-800 font-semibold mb-1">
              Welcome, {doctor.name}
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-500 flex items-center gap-2"
            >
              <Email fontSize="small" /> {doctor.email}
            </Typography>
          </div>
          <Avatar alt={doctor.name} sx={{ width: 56, height: 56 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-lg border border-blue-100">
            <CardContent>
              <Typography
                variant="h6"
                className="text-blue-700 mb-4 flex items-center gap-2"
              >
                <CalendarToday fontSize="small" /> Upcoming Appointments
              </Typography>
              {appointments.length > 0 ? (
                <List disablePadding>
                  {appointments.map((appt, idx) => (
                    <ListItem
                      key={idx}
                      className="hover:bg-blue-50 transition rounded-lg"
                    >
                      <ListItemIcon>
                        <Pets color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={appt.pet_name}
                        secondary={new Date(appt.date).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" className="text-gray-400">
                  No upcoming appointments.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Checked Pets Table */}
          <Card className="shadow-lg border border-blue-100">
            <CardContent>
              <Typography
                variant="h6"
                className="text-blue-700 mb-4 flex items-center gap-2"
              >
                <Pets fontSize="small" /> Previously Checked Pets
              </Typography>
              <TableContainer component={Paper} className="rounded-md">
                <Table size="small">
                  <TableHead className="bg-blue-100">
                    <TableRow>
                      <TableCell className="font-semibold">Pet Name</TableCell>
                      <TableCell className="font-semibold">Session Date</TableCell>
                      <TableCell className="font-semibold">Report</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkedPets.map((pet, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-blue-50 transition ease-in-out duration-200"
                      >
                        <TableCell>{pet.pet_name}</TableCell>
                        <TableCell>
                          {new Date(pet.session_date).toLocaleString()}
                        </TableCell>
                        <TableCell>{pet.report}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
