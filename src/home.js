//home.js
import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import cblogo from "./mylogo.png";
import image from "./farm.png";
import { DropzoneArea } from 'material-ui-dropzone';
import Clear from '@material-ui/icons/Clear';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.common.white),
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  // Update the styles as needed
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "100%",
    borderRadius: "20px", // Increased border radius
    padding: "20px 30px", // Increased padding for a larger button
    color: "black",
    fontSize: "24px", // Increased font size
    fontWeight: "bold",
    marginTop: "20px", // Add margin top for spacing
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "100vh",
    marginTop: "0",
  },
  imageCard: {
    margin: "auto",
    [theme.breakpoints.down('xl')]: {
      maxWidth: 550,
      height: 470,
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: 500,
      height: 420,
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 450,
      height: 370,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
      height: 320,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 350,
      height:270,
    },
    backgroundColor: 'lightgreen',
    boxShadow: '0px 9px 70px 0px rgba(0, 0, 0, 0.3) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  media: {
    [theme.breakpoints.down('xl')]: {
      height: 350,
    },
    [theme.breakpoints.down('lg')]: {
      height: 300,
    },
    [theme.breakpoints.down('md')]: {
      height: 250,
    },
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
    [theme.breakpoints.down('xs')]: {
      height: 150,
    },
  },
  noImage: {
    margin: "auto",
    [theme.breakpoints.down('xl')]: {
      width: 350,
      height: "350 !important",
    },
    [theme.breakpoints.down('lg')]: {
      width: 300,
      height: "300 !important",
    },
    [theme.breakpoints.down('md')]: {
      width: 250,
      height: "250 !important",
    },
    [theme.breakpoints.down('sm')]: {
      width: 200,
      height: "200 !important",
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: "150 !important",
    },
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
  },
  tableHead: {
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
  },
  tableRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'rgba(255, 255, 255, 0.7) !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: 'darkgreen',
    boxShadow: 'none',
    color: 'white'
  },
  loader: {
    color: '#3f51b5 !important',
  },
  cameraButton: {
    margin: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  rightButton: {
    position: 'absolute',
    top: theme.spacing(10), // Adjust based on the AppBar height
    right: theme.spacing(2),
  },
}));


export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setData(undefined);
      setImage(true);
    }
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Lewis Kuria: Potato Blight Classifier
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo}></Avatar>
          <Button 
          className={classes.rightButton}
          variant="contained"
          color="secondary"
          href="https://lewiskuria.projects.earthengine.app/view/myapp" // Replace with your desired URL
          target="_blank" // Opens the link in a new tab
          >
         Open Google Earth Engine
    </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.content}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                  dropzoneParagraphClass={classes.dropzoneText}
                  onChange={onSelectFile}
                />
                <Button variant="contained" className={classes.cameraButton} component="label">
                  <CameraAltIcon />
                  Take Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*;capture=camera"
                    onChange={handleCapture}
                  />
                </Button>
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableCell1}>Label:</TableCell>
                        <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                      <TableRow className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          {data.class}
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
              {isLoading && <CardContent className={classes.detail}>
                <CircularProgress color="secondary" className={classes.loader} />
                <Typography className={classes.title} variant="h6" noWrap>
                  Processing
                </Typography>
              </CardContent>}
            </Card>
          </Grid>
          {data &&
            <Grid item className={classes.buttonGrid} >
              <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear
              </ColorButton>
            </Grid>}
            
        </Grid>
      </Container>
    </React.Fragment>
  );
};
