import { GraduationCap, Award, BookOpen, Users, Trophy, Target, ArrowRight, Play, Lock, Star, Clock, CheckCircle } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  category: string;
  lessons: number;
  isEnrolled?: boolean;
  progress?: number;
}

const courses: Course[] = [
  {
    id: '1',
    title: '3D Printing Fundamentals',
    description: 'Master the basics of 3D printing from setup to first successful prints',
    instructor: 'Dr. Sarah Chen',
    duration: '4 weeks',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 1250,
    price: 49,
    thumbnail: '/api/placeholder/300/200',
    category: '3D Printing',
    lessons: 12,
    isEnrolled: true,
    progress: 75
  },
  {
    id: '2',
    title: 'Arduino Electronics Bootcamp',
    description: 'Build interactive electronics projects from simple circuits to IoT devices',
    instructor: 'Mike Rodriguez',
    duration: '6 weeks',
    difficulty: 'Intermediate',
    rating: 4.9,
    students: 892,
    price: 79,
    thumbnail: '/api/placeholder/300/200',
    category: 'Electronics',
    lessons: 18
  },
  {
    id: '3',
    title: 'CNC Machining Mastery',
    description: 'Professional CNC operations from CAM programming to precision manufacturing',
    instructor: 'James Wilson',
    duration: '8 weeks',
    difficulty: 'Advanced',
    rating: 4.7,
    students: 634,
    price: 149,
    thumbnail: '/api/placeholder/300/200',
    category: 'CNC',
    lessons: 24
  },
  {
    id: '4',
    title: 'Laser Cutting & Engraving',
    description: 'Create precise cuts and detailed engravings across various materials',
    instructor: 'Lisa Park',
    duration: '3 weeks',
    difficulty: 'Beginner',
    rating: 4.6,
    students: 567,
    price: 39,
    thumbnail: '/api/placeholder/300/200',
    category: 'Laser Cutting',
    lessons: 9
  },
  {
    id: '5',
    title: 'Product Design & Prototyping',
    description: 'Full product development cycle from concept to market-ready prototype',
    instructor: 'Alex Kumar',
    duration: '10 weeks',
    difficulty: 'Advanced',
    rating: 4.8,
    students: 423,
    price: 199,
    thumbnail: '/api/placeholder/300/200',
    category: 'Design',
    lessons: 30
  },
  {
    id: '6',
    title: 'Maker Business Fundamentals',
    description: 'Turn your maker skills into a profitable business with proven strategies',
    instructor: 'Rachel Thompson',
    duration: '5 weeks',
    difficulty: 'Intermediate',
    rating: 4.5,
    students: 789,
    price: 99,
    thumbnail: '/api/placeholder/300/200',
    category: 'Business',
    lessons: 15
  }
];

const categories = ['All', '3D Printing', 'Electronics', 'CNC', 'Laser Cutting', 'Design', 'Business'];

export default function Learn() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enrolledCourse, setEnrolledCourse] = useState<string | null>(null);

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleEnroll = (courseId: string) => {
    if (!isAuthenticated) {
      // Would redirect to login
      return;
    }
    setEnrolledCourse(courseId);
    // Simulate enrollment process
    setTimeout(() => {
      setEnrolledCourse(null);
      // Update course enrollment status
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
            <span className="text-makrx-brown">MakrX Learning Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the art and science of making with interactive courses, 
            skill badges, and hands-on projects from industry experts.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-makrx-brown">50+</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-makrx-blue">15k+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-makrx-yellow">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-makrx-brown">95%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-makrx-brown text-white'
                    : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => (
            <div key={course.id} className="makrx-glass-card group hover:scale-105 transition-transform">
              {/* Course Thumbnail */}
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.isEnrolled && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Enrolled
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.lessons} lessons
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">${course.price}</div>
                    <div className="text-xs text-muted-foreground">{course.students} students</div>
                  </div>
                  <div className="text-xs text-muted-foreground">by {course.instructor}</div>
                </div>

                {/* Progress bar for enrolled courses */}
                {course.isEnrolled && course.progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-makrx-brown h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {course.isEnrolled ? (
                    <button className="w-full bg-makrx-brown/20 text-makrx-brown py-2 rounded-lg hover:bg-makrx-brown/30 transition-colors flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Continue Learning
                    </button>
                  ) : isAuthenticated ? (
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolledCourse === course.id}
                      className="w-full bg-makrx-brown text-white py-2 rounded-lg hover:bg-makrx-brown/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {enrolledCourse === course.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Enroll Now
                        </>
                      )}
                    </button>
                  ) : (
                    <Link 
                      to="/login"
                      className="w-full bg-makrx-brown text-white py-2 rounded-lg hover:bg-makrx-brown/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Login to Enroll
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Path CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="makrx-glass-card text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-makrx-yellow mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Structured Learning Paths</h2>
              <p className="text-muted-foreground">
                Follow curated sequences of courses designed to build comprehensive skills
                in specific domains like 3D printing, electronics, or digital fabrication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-lg">
                <Award className="w-8 h-8 text-makrx-brown mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Skill Badges</h3>
                <p className="text-sm text-muted-foreground">Earn verified credentials</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <Users className="w-8 h-8 text-makrx-blue mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Community</h3>
                <p className="text-sm text-muted-foreground">Learn with peers</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <Target className="w-8 h-8 text-makrx-yellow mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Projects</h3>
                <p className="text-sm text-muted-foreground">Hands-on experience</p>
              </div>
            </div>

            {isAuthenticated ? (
              <button className="makrx-btn-primary">
                Explore Learning Paths
              </button>
            ) : (
              <Link to="/register" className="makrx-btn-primary">
                Start Learning Today
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
