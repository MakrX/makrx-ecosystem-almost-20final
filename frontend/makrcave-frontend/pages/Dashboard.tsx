import RoleDashboard from '../components/RoleDashboard';
import MakrXThemeToggle from '../components/MakrXThemeToggle';

export default function Dashboard() {
  return (
    <div>
      <RoleDashboard />
      <MakrXThemeToggle floating hideOnScroll />
    </div>
  );
}
