import { Container } from "react-bootstrap";

const Spinner = () => (
  <Container className="text-center">
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </Container>
);

export default Spinner;
