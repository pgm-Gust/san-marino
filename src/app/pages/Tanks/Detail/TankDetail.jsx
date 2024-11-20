import { useParams } from "react-router";
import Container from "@design/Container/Container";

const TankDetail = () => {
  const params = useParams();

  return (
    <Container>
      <h1>Tank Detail {params.slug}</h1>
    </Container>
  );
};

export default TankDetail;
