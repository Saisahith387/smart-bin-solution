
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, ArrowUpRight, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

import StatusIndicator from './StatusIndicator';
import { BinStatus, WasteType } from './BinStatusCard';

interface BinLocation {
  id: string;
  lat: number;
  lng: number;
  status: BinStatus;
  wasteType: WasteType;
  address: string;
}

interface MapViewProps {
  bins: BinLocation[];
  onBinSelect?: (binId: string) => void;
  onBinUpdate?: (bin: BinLocation) => void;
}

// Mock implementation for demo purposes
const MapView: React.FC<MapViewProps> = ({ bins, onBinSelect, onBinUpdate }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBin, setEditedBin] = useState<BinLocation | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // This would be replaced with actual map implementation
  useEffect(() => {
    if (mapRef.current) {
      // In a real implementation, we would initialize the map here
      console.log('Map would be initialized with bins:', bins);
    }
  }, [bins]);

  const handleBinClick = (bin: BinLocation) => {
    setSelectedBin(bin);
    if (onBinSelect) {
      onBinSelect(bin.id);
    }
  };

  const toggleEdit = () => {
    if (!isEditing && selectedBin) {
      setEditedBin({...selectedBin});
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedBin) return;
    
    const { name, value } = e.target;
    setEditedBin({
      ...editedBin,
      [name]: value
    });
  };

  const handleSave = () => {
    if (editedBin && onBinUpdate) {
      onBinUpdate(editedBin);
      setSelectedBin(editedBin);
    }
    setIsEditing(false);
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const getWasteTypeLabel = (type: WasteType) => {
    switch (type) {
      case 'general': return 'General Waste';
      case 'recycling': return 'Recycling';
      case 'compost': return 'Compost';
      case 'hazardous': return 'Hazardous Waste';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      {/* Placeholder map - would be replaced with actual map component */}
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"
      >
        <div className="text-center p-6">
          <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Interactive map would display here with {bins.length} bin locations
          </p>
        </div>
      </div>

      {/* Demo bin markers for visual representation */}
      <div className="absolute inset-0 pointer-events-none">
        {bins.map((bin, index) => {
          // Calculate pseudo-positions for demo
          const xPos = (20 + (index % 5) * 18) + '%';
          const yPos = (20 + Math.floor(index / 5) * 15) + '%';
          
          return (
            <motion.div
              key={bin.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ left: xPos, top: yPos }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleBinClick(bin)}
            >
              <div className="relative">
                <div className={`p-2 rounded-full 
                  ${bin.status === 'empty' ? 'bg-empty/20' : 
                    bin.status === 'half' ? 'bg-half/20' : 'bg-full/20'}`}
                >
                  <MapPin 
                    className={`h-5 w-5 
                      ${bin.status === 'empty' ? 'text-empty' : 
                        bin.status === 'half' ? 'text-half' : 'text-full'}`} 
                  />
                </div>
                {bin.status === 'full' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-full/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bin info card */}
      {selectedBin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 p-4 glass-card max-w-xs"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Bin #{selectedBin.id}</h3>
            <StatusIndicator status={selectedBin.status} showLabel={true} />
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{selectedBin.address}</p>
            <p>Type: {getWasteTypeLabel(selectedBin.wasteType)}</p>
          </div>
          
          <div className="flex justify-between mt-3">
            <button 
              className="flex items-center text-sm text-eco-600 hover:text-eco-700 font-medium"
              onClick={handleViewDetails}
            >
              <span>View Details</span>
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
            
            <button 
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={toggleEdit}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Location Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
          </DialogHeader>
          
          {selectedBin && !isEditing ? (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Location ID</p>
                <p className="text-sm text-muted-foreground">{selectedBin.id}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{selectedBin.address}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Waste Type</p>
                <p className="text-sm text-muted-foreground">{getWasteTypeLabel(selectedBin.wasteType)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center">
                  <StatusIndicator status={selectedBin.status} showLabel={true} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Coordinates</p>
                <p className="text-sm text-muted-foreground">
                  Lat: {selectedBin.lat.toFixed(6)}, Lng: {selectedBin.lng.toFixed(6)}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={toggleEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          ) : editedBin ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  name="address"
                  value={editedBin.address}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  name="lat"
                  type="number"
                  step="0.000001"
                  value={editedBin.lat}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  name="lng"
                  type="number"
                  step="0.000001"
                  value={editedBin.lng}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditedBin(null);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapView;
