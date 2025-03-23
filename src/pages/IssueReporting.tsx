
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Search, Filter, Plus, CheckCircle, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { getIssues, addIssue, updateIssueStatus } from '@/services/dataService';
import { Issue, IssueStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const IssueReporting = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
  
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    area: '',
    address: ''
  });
  
  const isAdmin = user?.role === 'admin';
  const isResident = user?.role === 'resident';
  
  useEffect(() => {
    loadIssues();
  }, []);
  
  const loadIssues = () => {
    setLoading(true);
    try {
      const data = getIssues();
      
      // If resident, only show their own issues
      if (isResident && user) {
        setIssues(data.filter(issue => issue.reportedBy === user.id));
      } else {
        setIssues(data);
      }
    } catch (error) {
      console.error('Error loading issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load issues',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIssue(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      addIssue({
        ...newIssue,
        reportedBy: user.id
      });
      
      setDialogOpen(false);
      loadIssues();
      toast({
        title: 'Success',
        description: 'Issue reported successfully',
      });
      
      setNewIssue({
        title: '',
        description: '',
        area: '',
        address: ''
      });
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to report issue',
        variant: 'destructive'
      });
    }
  };
  
  const handleResolveIssue = (issueId: string) => {
    if (!user) return;
    
    try {
      updateIssueStatus(issueId, 'resolved', user.id);
      loadIssues();
      toast({
        title: 'Success',
        description: 'Issue marked as resolved',
      });
    } catch (error) {
      console.error('Error resolving issue:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve issue',
        variant: 'destructive'
      });
    }
  };
  
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = !searchQuery 
      ? true 
      : issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchQuery.toLowerCase());
        
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              {isAdmin ? 'Issue Management' : 'Report an Issue'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              {isAdmin 
                ? 'View and resolve reported issues from residents' 
                : 'Report any waste collection issues or problems in your area'}
            </motion.p>
          </div>
          
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <Input 
                  type="text" 
                  placeholder="Search issues..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline"
                  className={filterStatus === 'all' ? 'bg-accent' : ''}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button 
                  variant="outline"
                  className={filterStatus === 'reported' ? 'bg-accent' : ''}
                  onClick={() => setFilterStatus('reported')}
                >
                  Pending
                </Button>
                <Button 
                  variant="outline"
                  className={filterStatus === 'resolved' ? 'bg-accent' : ''}
                  onClick={() => setFilterStatus('resolved')}
                >
                  Resolved
                </Button>
                
                {isResident && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-eco-500 hover:bg-eco-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Report Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report New Issue</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitIssue} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Issue Title</label>
                          <Input 
                            name="title"
                            value={newIssue.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Missed Collection"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Area</label>
                          <Input 
                            name="area"
                            value={newIssue.area}
                            onChange={handleInputChange}
                            placeholder="e.g., Downtown"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Address</label>
                          <Input 
                            name="address"
                            value={newIssue.address}
                            onChange={handleInputChange}
                            placeholder="e.g., Main Street & 5th Ave"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea 
                            name="description"
                            value={newIssue.description}
                            onChange={handleInputChange}
                            placeholder="Please describe the issue in detail..."
                            rows={4}
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-eco-500 hover:bg-eco-600">
                            Submit Issue
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={loadIssues}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Issues List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-medium mb-6">
              {isAdmin ? 'All Reported Issues' : 'Your Reported Issues'}
            </h2>
            
            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-eco-500" />
                <p className="mt-4 text-muted-foreground">Loading issues...</p>
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="py-20 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                <p className="mt-4 text-muted-foreground">No issues found</p>
                {isResident && (
                  <Button 
                    className="mt-4 bg-eco-500 hover:bg-eco-600"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredIssues.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    isAdmin={isAdmin}
                    onResolve={handleResolveIssue}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

interface IssueCardProps {
  issue: Issue;
  isAdmin: boolean;
  onResolve: (issueId: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, isAdmin, onResolve }) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch (error) {
      return dateStr;
    }
  };
  
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'resolved': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      default: return 'bg-amber-500 text-white';
    }
  };
  
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-medium">{issue.title}</h3>
              <Badge className={getStatusColor(issue.status)}>
                {issue.status === 'reported' ? 'Pending' : issue.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {issue.area} - {issue.address}
            </p>
          </div>
          
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs text-muted-foreground">
              Reported: {formatDate(issue.reportedAt)}
            </span>
          </div>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-md mb-4">
          <p className="text-sm">{issue.description}</p>
        </div>
        
        {issue.status === 'resolved' && issue.resolvedAt && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span>Resolved on {formatDate(issue.resolvedAt)}</span>
          </div>
        )}
      </div>
      
      {isAdmin && issue.status === 'reported' && (
        <div className="bg-muted/30 px-5 py-3 flex justify-end">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onResolve(issue.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Resolved
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueReporting;
