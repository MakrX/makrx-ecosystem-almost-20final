import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Zap, AlertTriangle, Settings, Monitor, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sound effect simulation through visual feedback
const playClickSound = () => {
  // Visual feedback for click (simulates sound)
  const clickFeedback = document.createElement('div');
  clickFeedback.className = 'fixed top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-md text-sm z-50 animate-bounce';
  clickFeedback.textContent = '🔊 *BEEP*';
  document.body.appendChild(clickFeedback);
  setTimeout(() => {
    document.body.removeChild(clickFeedback);
  }, 500);
};

const playSuccessSound = () => {
  // Visual feedback for success
  const successFeedback = document.createElement('div');
  successFeedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm z-50 animate-pulse';
  successFeedback.textContent = '🔊 *SUCCESS*';
  document.body.appendChild(successFeedback);
  setTimeout(() => {
    document.body.removeChild(successFeedback);
  }, 1000);
};

// Glitch text component
const GlitchText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`${className} ${isGlitching ? 'glitch-effect text-red-400 screen-flicker' : ''} transition-all duration-200`}>
      {children}
    </span>
  );
};

// Broken machine component
const BrokenMachine = ({ name, status, sparks = false }: { name: string; status: string; sparks?: boolean }) => {
  const [isFlickering, setIsFlickering] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 100);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleMachineClick = () => {
    setClicked(true);
    playClickSound();
    setTimeout(() => setClicked(false), 200);
  };

  return (
    <div
      className={`relative bg-gray-900 border border-red-500/30 rounded-lg p-4 cursor-pointer hover:border-red-400/50 transform transition-all duration-100 ${
        isFlickering ? 'bg-red-900/20 screen-flicker' : ''
      } ${clicked ? 'scale-95 bg-red-800/30' : 'hover:scale-105'}`}
      onClick={handleMachineClick}
    >
      {sparks && (
        <div className="absolute -top-2 -right-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full sparks"></div>
          <div className="absolute top-1 right-1 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute -top-1 right-0 w-1 h-1 bg-red-500 rounded-full sparks animation-delay-500"></div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-sm">{name}</h3>
        <AlertTriangle className={`h-4 w-4 text-red-400 ${isFlickering ? 'animate-bounce' : ''}`} />
      </div>
      <div className="text-red-400 text-xs font-mono">{status}</div>
      <div className="mt-2 bg-gray-800 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-red-500 animate-pulse" style={{ width: '0%' }}></div>
      </div>
      {clicked && (
        <div className="absolute inset-0 bg-red-500/20 rounded-lg animate-ping"></div>
      )}
    </div>
  );
};

// Minigame component
const ReviveLabGame = ({ onGameComplete }: { onGameComplete: () => void }) => {
  const [gameStage, setGameStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [clicks, setClicks] = useState(0);

  const tasks = [
    'Rerouting power circuits...',
    'Calibrating servo motors...',
    'Initializing safety protocols...',
    'Recompiling firmware...',
    'Connecting to network...',
    'Lab revival complete!'
  ];

  const handleReviveClick = useCallback(() => {
    if (isCompleted) return;

    playClickSound();
    setClicks(prev => prev + 1);

    const newProgress = Math.min(progress + (Math.random() * 15 + 5), 100);
    setProgress(newProgress);

    if (newProgress >= 100 && gameStage < tasks.length - 1) {
      setGameStage(prev => prev + 1);
      setProgress(0);
      playSuccessSound();
    } else if (newProgress >= 100 && gameStage === tasks.length - 1) {
      setIsCompleted(true);
      playSuccessSound();
      setTimeout(() => {
        onGameComplete();
      }, 2000);
    }
  }, [progress, gameStage, tasks.length, isCompleted, onGameComplete]);

  useEffect(() => {
    setCurrentTask(tasks[gameStage]);
  }, [gameStage, tasks]);

  return (
    <Card className="bg-black/80 border-cyan-500/50 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">🔧 Lab Revival Protocol</h3>
          <p className="text-gray-300 text-sm">Click the power button rapidly to revive the lab!</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{currentTask}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-800 border border-cyan-500/30" />
          <div className="text-center text-xs text-gray-500 mt-1">
            Stage {gameStage + 1} of {tasks.length}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleReviveClick}
            disabled={isCompleted}
            className={`
              w-24 h-24 rounded-full text-2xl font-bold transition-all duration-200 transform
              ${isCompleted 
                ? 'bg-green-600 hover:bg-green-600 text-white cursor-default scale-110' 
                : 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:scale-105 active:scale-95'
              }
            `}
          >
            {isCompleted ? '✓' : <Zap className="h-8 w-8" />}
          </Button>
          
          <div className="mt-4 text-center">
            <div className="text-cyan-400 text-sm">Power Level: {Math.round(progress)}%</div>
            <div className="text-gray-500 text-xs">Clicks: {clicks}</div>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-6 text-center">
            <div className="text-green-400 font-bold text-lg animate-pulse">
              🎉 Lab Successfully Revived! 🎉
            </div>
            <div className="text-gray-300 text-sm mt-2">
              All systems operational. Great work, engineer!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const NotFound = () => {
  const [showMinigame, setShowMinigame] = useState(false);
  const [labRevived, setLabRevived] = useState(false);
  const [hiddenButtonVisible, setHiddenButtonVisible] = useState(false);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticComplete, setDiagnosticComplete] = useState(false);

  // Show hidden button after some time or interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenButtonVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGameComplete = () => {
    setLabRevived(true);
    setShowMinigame(false);
  };

  if (labRevived) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 animate-bounce">
            <div className="text-8xl mb-4">🧪</div>
            <h1 className="text-6xl font-bold text-green-400 mb-4">Lab Revived!</h1>
            <p className="text-xl text-green-300 mb-8">
              Excellent work, engineer! The lab is now fully operational.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
              <Monitor className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-green-300 text-sm">All Systems Online</div>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <Settings className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-blue-300 text-sm">Equipment Calibrated</div>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-lg p-4">
              <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-cyan-300 text-sm">Power Restored</div>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white px-8 py-3 text-lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to MakrCave
              </Button>
            </Link>
            <div className="text-gray-400 text-sm">
              Thanks for helping us get back online! 🚀
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-orange-500 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-30"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          {!showMinigame ? (
            <>
              {/* Main 404 Content */}
              <div className="mb-12">
                <div className="text-9xl md:text-[12rem] font-bold text-red-500 mb-4 leading-none">
                  <GlitchText>4</GlitchText>
                  <GlitchText>0</GlitchText>
                  <GlitchText>4</GlitchText>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  <GlitchText>MAKER NOT FOUND</GlitchText>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  <GlitchText>Critical system failure detected in Lab Section 404</GlitchText>
                </p>
              </div>

              {/* Glitching Code Display */}
              <Card className="bg-black/80 border border-red-500/50 mb-8 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="text-left font-mono text-sm text-gray-300 space-y-1">
                    <div><span className="text-red-400">ERROR:</span> <GlitchText>ResourceNotFoundException</GlitchText></div>
                    <div><span className="text-yellow-400">WARN:</span> Power systems at 12% capacity</div>
                    <div><span className="text-red-400">FATAL:</span> <GlitchText>Equipment array disconnected</GlitchText></div>
                    <div><span className="text-blue-400">INFO:</span> Attempting auto-recovery...</div>
                    <div><span className="text-red-400">ERROR:</span> <GlitchText>Recovery protocol failed</GlitchText></div>
                    <div className="text-red-500 animate-pulse">{'>>> MANUAL INTERVENTION REQUIRED <<<'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Broken Machines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <BrokenMachine 
                  name="3D Printer Array" 
                  status="OFFLINE - Extruder jam detected"
                  sparks={true}
                />
                <BrokenMachine 
                  name="CNC Router" 
                  status="ERROR - Spindle motor failure"
                />
                <BrokenMachine 
                  name="Laser Cutter" 
                  status="FAULT - Cooling system down"
                  sparks={true}
                />
                <BrokenMachine 
                  name="Soldering Station" 
                  status="OFFLINE - Temperature sensor fail"
                />
                <BrokenMachine 
                  name="Power Supply" 
                  status="CRITICAL - Voltage instability"
                  sparks={true}
                />
                <BrokenMachine 
                  name="Network Hub" 
                  status="DISCONNECTED - No signal"
                />
              </div>

              {/* Hidden Revive Button */}
              <div className="space-y-4">
                <Link to="/">
                  <Button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Return to Base
                  </Button>
                </Link>
                
                {hiddenButtonVisible && (
                  <div className="mt-8">
                    <Button
                      onClick={() => setShowMinigame(true)}
                      className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-2 text-sm animate-pulse"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Emergency Revive Lab
                    </Button>
                    <div className="text-xs text-gray-500 mt-2">
                      ⚡ Hidden protocol detected
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <ReviveLabGame onGameComplete={handleGameComplete} />
          )}
        </div>
      </div>

      {/* Additional atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>
    </div>
  );
};

export default NotFound;
