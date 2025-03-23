
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Search, ArrowRight, HelpCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageTransition from '@/components/PageTransition';
import { WasteGuideItem } from '@/types';
import wasteGuideData from '@/data/wasteGuide.json';

const WasteGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<{ type: 'user' | 'bot', text: string }[]>([
    { type: 'bot', text: 'Hello! I can help you with waste sorting questions. What would you like to know?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No need to do anything here, we'll filter in real-time
  };
  
  const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    
    // Generate a response based on simple pattern matching
    const question = userMessage.toLowerCase();
    let response = "I'm not sure about that. Try asking about specific waste items or categories.";
    
    // Simple pattern matching for common questions
    if (question.includes('plastic') || question.includes('bottle')) {
      response = "Most plastic bottles and containers (types 1-7) can be recycled. Rinse them first and remove any caps or lids. Different regions have different rules about plastic bags - many grocery stores collect them separately.";
    } else if (question.includes('paper') || question.includes('cardboard')) {
      response = "Clean paper and cardboard should go in the recycling bin. Flatten cardboard boxes to save space. Paper with food residue like pizza boxes should go in the compost bin.";
    } else if (question.includes('food') || question.includes('compost') || question.includes('organic')) {
      response = "Food scraps, coffee grounds, tea bags, and yard waste can typically be composted. This reduces methane emissions from landfills and creates nutrient-rich soil.";
    } else if (question.includes('battery') || question.includes('electronics') || question.includes('hazardous')) {
      response = "Batteries, electronics, paint, and chemicals should never go in regular trash. Take them to designated hazardous waste collection centers in your community.";
    } else if (question.includes('glass')) {
      response = "Glass bottles and jars are 100% recyclable and can be recycled endlessly! Rinse them and remove lids before recycling. Note that drinking glasses, window glass, and mirrors are made differently and usually can't be recycled.";
    } else if (question.includes('help') || question.includes('how')) {
      response = "Check our guide above for specific waste categories. The best strategy is to reduce waste first, reuse when possible, and recycle as a last resort. Look for local guidelines as recycling rules vary by location.";
    }
    
    // Add bot response after a small delay to simulate thinking
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 800);
    
    // Clear the input
    setUserMessage('');
  };
  
  const filteredGuideItems: WasteGuideItem[] = searchQuery
    ? wasteGuideData.filter(item => 
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.items.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : wasteGuideData;
  
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
              Waste Segregation Guide
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Learn how to properly sort and dispose of different types of waste
            </motion.p>
          </div>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 mb-6"
          >
            <form onSubmit={handleSearch} className="relative">
              <Input 
                type="text" 
                placeholder="Search for specific waste items or materials..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </form>
          </motion.div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guide Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-card p-6 lg:col-span-2"
            >
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <Recycle className="h-5 w-5 mr-2 text-eco-500" />
                Waste Disposal Categories
              </h2>
              
              {filteredGuideItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No waste categories found matching your search.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredGuideItems.map((item, index) => (
                    <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-medium mb-3 text-lg">{item.category}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.items.map((subItem, subIndex) => (
                          <span 
                            key={subIndex} 
                            className="bg-muted px-3 py-1 rounded-full text-sm"
                          >
                            {subItem}
                          </span>
                        ))}
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-md">
                        <div className="flex items-start">
                          <ArrowRight className="h-5 w-5 mr-2 text-eco-500 mt-0.5 shrink-0" />
                          <p>{item.disposalMethod}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Assistant Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center mb-6">
                <HelpCircle className="h-5 w-5 mr-2 text-eco-500" />
                <h2 className="text-xl font-medium">Recycling Assistant</h2>
              </div>
              
              <div className="flex flex-col h-[400px]">
                <div className="flex-grow overflow-y-auto mb-4 pr-1">
                  {chatMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`mb-3 ${
                        message.type === 'user' 
                          ? 'flex justify-end' 
                          : 'flex justify-start'
                      }`}
                    >
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.type === 'user'
                          ? 'bg-eco-100 text-eco-800'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSubmitQuestion} className="flex items-center">
                  <Input 
                    type="text"
                    placeholder="Ask about waste sorting..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="flex-grow mr-2"
                  />
                  <Button type="submit" className="bg-eco-500 hover:bg-eco-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="glass-card p-6 mt-6"
          >
            <h2 className="text-xl font-medium mb-6">Waste Reduction Tips</h2>
            
            <Tabs defaultValue="reduce">
              <TabsList className="mb-4">
                <TabsTrigger value="reduce" className="flex-1">Reduce</TabsTrigger>
                <TabsTrigger value="reuse" className="flex-1">Reuse</TabsTrigger>
                <TabsTrigger value="recycle" className="flex-1">Recycle</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reduce" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Buy Less, Choose Well</h3>
                  <p>Consider if you really need a new item before purchasing. Quality items may cost more initially but last longer and create less waste.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Minimize Packaging</h3>
                  <p>Choose products with minimal or recyclable packaging. Buy in bulk when possible to reduce packaging waste.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Use Reusable Alternatives</h3>
                  <p>Replace single-use items with reusable versions: water bottles, shopping bags, coffee cups, food containers, and more.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reuse" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Repair Before Replacing</h3>
                  <p>Learn basic repair skills or find local repair services for clothing, electronics, and household items.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Creative Reuse</h3>
                  <p>Repurpose glass jars for storage, use old t-shirts as cleaning rags, or transform cardboard boxes into organizers.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Donate or Sell</h3>
                  <p>Items you no longer need might be useful to others. Donate to thrift stores or sell online instead of throwing away.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="recycle" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Know Your Local Rules</h3>
                  <p>Recycling guidelines vary by location. Check with your local waste management service to learn what's accepted.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Clean Before Recycling</h3>
                  <p>Rinse containers and remove food residue. Contaminated recyclables often end up in landfills.</p>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Special Item Recycling</h3>
                  <p>Many items can't go in regular recycling but have special programs: electronics, batteries, light bulbs, paint, and more.</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default WasteGuide;
