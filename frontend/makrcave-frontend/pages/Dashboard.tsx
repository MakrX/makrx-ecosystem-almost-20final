import RoleDashboard from '../components/RoleDashboard';
import { ThemeToggle } from '../../../packages/ui/components/ThemeToggle';

export default function Dashboard() {
  return (
    <div>
      <RoleDashboard />
      <MakrXThemeToggle floating hideOnScroll />
    </div>
  );
}
