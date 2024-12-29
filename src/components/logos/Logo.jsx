import logo from '../../assets/logo2.png';
import { cn } from '../../utils/cn';
const Logo = ({ className }) => (
  <img
    src={logo}
    alt="Octopi Digital"
    loading="lazy"
    className={cn('w-full', className)}
  />
);

export default Logo;
