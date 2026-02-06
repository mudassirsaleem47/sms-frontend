import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconDots,
    IconStar,
    IconCopy,
    IconGripVertical,
} from '@tabler/icons-react';
import { Calendar } from '@/components/ui/calendar';
import PasswordInput from '@/components/ui/password';

const ComponentTest = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [date, setDate] = useState(new Date());

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Component Testing Playground</h1>
                <p className="text-muted-foreground mt-2">
                    Test and preview Shadcn UI components here
                </p>
            </div>

            {/* Your test area - Add components below */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Area</CardTitle>
                    <CardDescription>
                        Add your components here for testing
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Start adding components to test them...
                    </p>

                    {/* Example: Button variants */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Buttons</h3>
                        <div className="flex gap-2">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                        </div>
                    </div>

                    {/* Example: Badges */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Badges</h3>
                        <div className="flex gap-2">
                            <Input placeholder="Enter text" />
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                        </div>
                    </div>

                    {/* Example: Avatar */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Avatars</h3>
                        <div className="flex gap-2">
                            <Avatar>
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
                            </Avatar>
                            <Avatar>
                                <AvatarFallback className="bg-green-500 text-white">XY</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Example: Table */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Sample Table</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell className="font-medium">John Doe</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500">Done</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <IconDots className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <IconEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <IconCopy className="mr-2 h-4 w-4" />
                                                    Copy
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <IconTrash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Example: Calendar */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Calendar</h3>
                        <div className="flex justify-center p-4 border rounded-lg">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Selected: {date ? date.toLocaleDateString() : 'No date selected'}
                        </p>
                    </div>

                    {/* Example: Password Input */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Password Input</h3>
                        <PasswordInput />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComponentTest;
