import { ReactNode } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export function Layout(props: {children: ReactNode}) {
  return (
    <div>
    <NavMenu />
    <Container tag="main">
      {props.children}
    </Container>
  </div>
  );
}

