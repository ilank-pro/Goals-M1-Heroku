import DocumentsSection from '../components/DocumentsSection';

const PersonDetails = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <GoalsSection personId={person.id} />
          <DocumentsSection personId={person.id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PersonDetails; 