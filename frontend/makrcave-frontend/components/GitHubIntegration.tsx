import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileText, 
  Folder, 
  Eye, 
  Download, 
  ExternalLink,
  RefreshCw,
  Link,
  Unlink,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Star,
  Users
} from 'lucide-react';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  url: string;
  html_url: string;
  download_url?: string;
}

interface GitHubCommit {
  sha: string;
  message: string;
  author_name: string;
  author_email: string;
  author_date: string;
  url: string;
  added_files: string[];
  modified_files: string[];
  removed_files: string[];
}

interface GitHubIntegrationProps {
  projectId: string;
  isConnected: boolean;
  repoUrl?: string;
  repoName?: string;
  defaultBranch?: string;
  canEdit: boolean;
  onUpdate: () => void;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({
  projectId,
  isConnected,
  repoUrl,
  repoName,
  defaultBranch = 'main',
  canEdit,
  onUpdate
}) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'commits'>('files');

  useEffect(() => {
    if (isConnected) {
      fetchFiles();
      fetchCommits();
    }
  }, [isConnected, currentPath]);

  const fetchFiles = async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const params = new URLSearchParams();
      if (currentPath) params.append('path', currentPath);
      
      const response = await fetch(`/api/v1/projects/${projectId}/github/files?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        setError('Failed to fetch repository files');
      }
    } catch (err) {
      setError('Error fetching files');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommits = async () => {
    if (!isConnected) return;

    try {
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/projects/${projectId}/github/commits?per_page=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommits(data);
      }
    } catch (err) {
      console.error('Error fetching commits:', err);
    }
  };

  const fetchFileContent = async (file: GitHubFile) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const params = new URLSearchParams({ file_path: file.path });
      
      const response = await fetch(`/api/v1/projects/${projectId}/github/files/content?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFileContent(data.content);
        setSelectedFile(file);
      } else {
        setError('Failed to fetch file content');
      }
    } catch (err) {
      setError('Error fetching file content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!newRepoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/projects/${projectId}/github/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_url: newRepoUrl,
          access_token: accessToken || null,
          default_branch: 'main'
        }),
      });

      if (response.ok) {
        onUpdate();
        setShowConnectModal(false);
        setNewRepoUrl('');
        setAccessToken('');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to connect repository');
      }
    } catch (err) {
      setError('Error connecting repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect the GitHub repository?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/projects/${projectId}/github/disconnect`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onUpdate();
        setFiles([]);
        setCommits([]);
        setCurrentPath('');
      } else {
        setError('Failed to disconnect repository');
      }
    } catch (err) {
      setError('Error disconnecting repository');
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/projects/${projectId}/github/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh activity and commits
        onUpdate();
        fetchCommits();
        // Show success message
      } else {
        setError('Failed to sync GitHub activity');
      }
    } catch (err) {
      setError('Error syncing GitHub activity');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
    setFileContent('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getFileIcon = (file: GitHubFile) => {
    if (file.type === 'dir') return <Folder className="h-4 w-4 text-blue-600" />;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'md':
      case 'txt':
      case 'rst':
        return <FileText className="h-4 w-4 text-gray-600" />;
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
        return <Code className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Github className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect GitHub Repository</h3>
            <p className="text-gray-600 mb-4">
              Connect your project to a GitHub repository to manage files and track commits directly from your project.
            </p>
            {canEdit && (
              <Button onClick={() => setShowConnectModal(true)}>
                <Link className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
            )}
          </div>

          {/* Connect Repository Modal */}
          <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Connect GitHub Repository</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-red-800 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="repo-url">Repository URL *</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="access-token">Access Token (Optional)</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="Required for private repositories"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for public repositories. Required for private repositories.
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowConnectModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConnect} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Repository Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-gray-700" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  {repoName}
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Branch: {defaultBranch} • 
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    View on GitHub
                    <ExternalLink className="h-3 w-3 inline ml-1" />
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
                <Sync className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Sync
              </Button>
              {canEdit && (
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <Unlink className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant={activeTab === 'files' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('files')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Files
            </Button>
            <Button
              variant={activeTab === 'commits' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('commits')}
            >
              <GitCommit className="h-4 w-4 mr-2" />
              Commits
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              {/* Breadcrumb Navigation */}
              {currentPath && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Button variant="ghost" size="sm" onClick={() => navigateToPath('')}>
                    {repoName}
                  </Button>
                  {currentPath.split('/').map((segment, index, array) => (
                    <React.Fragment key={index}>
                      <span>/</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateToPath(array.slice(0, index + 1).join('/'))}
                      >
                        {segment}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* File List */}
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (file.type === 'dir') {
                        navigateToPath(file.path);
                      } else {
                        fetchFileContent(file);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        {file.type === 'file' && (
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.type === 'file' && file.download_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.download_url, '_blank');
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file.html_url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {files.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No files found in this directory</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Commits Tab */}
          {activeTab === 'commits' && (
            <div className="space-y-4">
              {commits.map((commit) => (
                <div key={commit.sha} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{commit.message}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{commit.author_name}</span>
                        <span>{formatDate(commit.author_date)}</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {commit.sha.substring(0, 7)}
                        </span>
                      </div>
                      
                      {/* File changes */}
                      <div className="flex items-center space-x-4 text-xs">
                        {commit.added_files.length > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            +{commit.added_files.length} added
                          </Badge>
                        )}
                        {commit.modified_files.length > 0 && (
                          <Badge variant="outline" className="text-blue-600">
                            ~{commit.modified_files.length} modified
                          </Badge>
                        )}
                        {commit.removed_files.length > 0 && (
                          <Badge variant="outline" className="text-red-600">
                            -{commit.removed_files.length} removed
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(commit.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {commits.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <GitCommit className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No commits found</p>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-6 w-6 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Content Modal */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(selectedFile)}
                {selectedFile.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                <code>{fileContent}</code>
              </pre>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => window.open(selectedFile.html_url, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
              {selectedFile.download_url && (
                <Button onClick={() => window.open(selectedFile.download_url!, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GitHubIntegration;
