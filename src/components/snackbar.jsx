const CustomSnackbar = styled('div')(
    ({ theme }) => css`
      position: fixed;
      z-index: 5500;
      display: flex;
      right: 16px;
      bottom: 16px;
      left: auto;
      justify-content: space-between;
      max-width: 560px;
      min-width: 300px;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: ${theme.palette.mode === 'dark'
        ? `0 2px 8px rgb(0 0 0 / 0.5)`
        : `0 2px 8px ${grey[200]}`};
      padding: 0.75rem;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      animation: ${snackbarInRight} 200ms;
      transition: transform 0.2s ease-out;
    `,
  );