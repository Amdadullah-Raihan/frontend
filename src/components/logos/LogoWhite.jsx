import logoWhite from '../../assets/logo-white.png';
import { cn } from '../../utils/cn';

const LogoWhite = ({ className }) => (
  <img
    src={logoWhite}
    alt="Octopi Digital"
    loading="lazy"
    className={cn('w-full', className)}
  />
);
export default LogoWhite;
