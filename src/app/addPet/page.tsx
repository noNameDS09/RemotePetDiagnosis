'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PawPrint, PlusCircle, Loader2 } from 'lucide-react';

export default function AddPetPage() {
  const [name, setName] = useState('');
  const [typeOfAnimal, setTypeOfAnimal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/pet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, typeOfAnimal }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Pet Added',
          description: `Pet "${data.pet.name}" was successfully added!`,
        });
        router.push('/user'); // or wherever you show pets
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to add pet.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log('Error adding pet:', error);
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Add a New Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Fluffy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeOfAnimal">Type of Animal</Label>
              <Input
                id="typeOfAnimal"
                type="text"
                placeholder="Dog, Cat, Rabbit..."
                value={typeOfAnimal}
                onChange={(e) => setTypeOfAnimal(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Adding...' : 'Add Pet'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground justify-center">
          Make sure your pet isn’t already added!
        </CardFooter>
      </Card>
    </div>
  );
}
