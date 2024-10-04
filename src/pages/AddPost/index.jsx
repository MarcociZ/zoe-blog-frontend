import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, Link, useParams } from "react-router-dom"
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { selectIsAuth } from "../../redux/slices/auth"
import axios from "../../axios.js"


export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const inputFileRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setTags(data.tags.join(","));
          setText(data.text);
          setImageUrl(data.imageUrl);
        }).catch((err) => {
          console.warn(err);
          alert('Error during post rendering');
        });

    }
  }, []);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      console.log(file);

      formData.append('image', file);

      const { data } = await axios.post('/uploads', formData)
      setImageUrl(data.url);

    } catch (err) {
      console.warn(err);
      alert('Error occured while editing the post ' + err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChangeText = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        text,
        imageUrl,
        tags
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields).catch((err) => console.log(err))
        : await axios.post('/posts', fields).catch((err) => console.log(err));

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);

    } catch (error) {
      console.warn(error);
      alert('Error while uploading the post');
    }

  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Place your text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  };

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Attach Image
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Remove Image
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Place a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChangeText} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Public"}
        </Button>
        <Link to="/">
          <Button size="large">Undo</Button>
        </Link>
      </div>
    </Paper>
  );
};
