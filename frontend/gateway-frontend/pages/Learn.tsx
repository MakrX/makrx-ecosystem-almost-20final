import { GraduationCap, Award, BookOpen, Users, Trophy, Target, ArrowRight, Play, Lock } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Learn() {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-makrx-brown/20 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-makrx-brown" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-makrx-brown">Learning Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the art and science of making with interactive courses, 
            skill badges, and community-driven learning paths.
          </p>
        </div>

        {/* Learning Paths Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Courses</h3>
            <p className="text-muted-foreground">
              Step-by-step tutorials with hands-on projects, from beginner electronics to advanced manufacturing.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Badges</h3>
            <p className="text-muted-foreground">
              Earn verified badges for mastering specific tools, techniques, and safety protocols.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Learning</h3>
            <p className="text-muted-foreground">
              Learn from experienced makers through mentorship programs and collaborative projects.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Certifications</h3>
            <p className="text-muted-foreground">
              Industry-recognized certifications for 3D printing, CNC, electronics, and more.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Assessments</h3>
            <p className="text-muted-foreground">
              Test your knowledge and abilities with practical challenges and peer reviews.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
            <p className="text-muted-foreground">
              Structured curricula for specific goals like product design, fabrication, or entrepreneurship.
            </p>
          </div>
        </div>

        {/* Featured Learning Tracks */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Learning Tracks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="makrx-glass-card">
              <h3 className="text-xl font-bold mb-3 text-makrx-blue">3D Printing Mastery</h3>
              <p className="text-muted-foreground mb-4">
                From first print to advanced multi-material manufacturing
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Printer setup and calibration</span>
                  <span className="text-makrx-yellow">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span>• Material science fundamentals</span>
                  <span className="text-makrx-yellow">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>• Advanced post-processing</span>
                  <span className="text-makrx-brown">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span>• Industrial applications</span>
                  <span className="text-makrx-brown">Expert</span>
                </div>
              </div>
            </div>

            <div className="makrx-glass-card">
              <h3 className="text-xl font-bold mb-3 text-makrx-yellow">Electronics & IoT</h3>
              <p className="text-muted-foreground mb-4">
                Build smart devices from concept to connected product
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Circuit design basics</span>
                  <span className="text-makrx-yellow">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span>• Microcontroller programming</span>
                  <span className="text-makrx-yellow">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>• Wireless communication</span>
                  <span className="text-makrx-brown">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span>• Product development</span>
                  <span className="text-makrx-brown">Expert</span>
                </div>
              </div>
            </div>

            <div className="makrx-glass-card">
              <h3 className="text-xl font-bold mb-3 text-makrx-brown">Digital Fabrication</h3>
              <p className="text-muted-foreground mb-4">
                Master CNC, laser cutting, and precision manufacturing
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• CAD design principles</span>
                  <span className="text-makrx-yellow">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span>• CNC programming</span>
                  <span className="text-makrx-yellow">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>• Tool path optimization</span>
                  <span className="text-makrx-brown">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span>• Quality control systems</span>
                  <span className="text-makrx-brown">Expert</span>
                </div>
              </div>
            </div>

            <div className="makrx-glass-card">
              <h3 className="text-xl font-bold mb-3 text-makrx-blue">Maker Business</h3>
              <p className="text-muted-foreground mb-4">
                Turn your maker skills into a sustainable business
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Market research & validation</span>
                  <span className="text-makrx-yellow">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span>• Product development cycle</span>
                  <span className="text-makrx-yellow">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>• Scaling manufacturing</span>
                  <span className="text-makrx-brown">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span>• Global market strategy</span>
                  <span className="text-makrx-brown">Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="makrx-glass-card">
            <h2 className="text-2xl font-bold mb-4">🎓 Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The MakrX Learning Hub is being designed by educators and industry experts 
              to provide the most comprehensive maker education platform ever created.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p>• Adaptive learning paths based on your interests and skill level</p>
              <p>• Virtual reality training for complex procedures and safety protocols</p>
              <p>• AI-powered progress tracking and personalized recommendations</p>
              <p>• Industry partnerships for internships and job placement</p>
              <p>• Global maker mentorship network and peer collaboration</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="makrx-btn-primary">
                Join Learning Beta
              </button>
              <button className="makrx-btn-secondary">
                Become an Instructor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
