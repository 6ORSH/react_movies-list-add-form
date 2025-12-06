import React, { useState } from 'react';
import { Movie } from '../../types/Movie';
import { TextField } from '../TextField';

const defaultFormValues = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

type Props = {
  onAdd?: (movie: Movie) => void;
};

type FormErrors = Partial<Record<keyof typeof defaultFormValues, string>>;

export const NewMovie: React.FC<Props> = ({ onAdd = () => {} }) => {
  // Increase the count after successful form submission to reset touched status of all the `Field`s
  const [count, setCount] = useState(0);
  const [movie, setMovie] =
    React.useState<typeof defaultFormValues>(defaultFormValues);

  const isSubmitDisabled = Object.entries(movie).some(([key, value]) => {
    if (key === 'description') {
      return false;
    }

    return !value.trim();
  });

  const validURlPattern =
    '/^((([A-Za-z]{3,9}:(?://)?)(?:[-;:&=+$,w]+@)?[A-Za-z0-9.-]' +
    '+|(?:www.|[-;:&=+$,w]+@)[A-Za-z0-9.-]' +
    '+)((?:/[+~%/.w-_]*)???(?:[-+=&;%@,.w_]*)#?(?:[,.!/\\w]*))?)$/';
  function validate(values: typeof defaultFormValues): FormErrors {
    const formErrors: FormErrors = {};

    if (!values.title.trim()) {
      formErrors.title = 'Title is required';
    }

    if (!values.imgUrl.trim()) {
      formErrors.imgUrl = 'Image URL is required';
    }

    if (!values.imdbUrl.trim()) {
      formErrors.imdbUrl = 'Imdb URL is required';
    }

    if (!values.imdbId.trim()) {
      formErrors.imdbId = 'Imdb ID is required';
    }

    return formErrors;
  }

  function handleChange(name: string, value: string) {
    setMovie(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors = validate(movie);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onAdd(movie);

    setMovie(defaultFormValues);
    // Clear the form
    setCount(c => c + 1);
  }

  return (
    <form className="NewMovie" key={count} onSubmit={handleSubmit} noValidate>
      <h2 className="title">Add a movie</h2>

      <TextField
        name="title"
        label="Title"
        value={movie.title}
        required
        onChange={val => handleChange('title', val)}
      />

      <TextField
        name="description"
        label="Description"
        value={movie.description}
        onChange={val => handleChange('description', val)}
      />

      <TextField
        name="imgUrl"
        label="Image URL"
        value={movie.imgUrl}
        required
        onChange={val => handleChange('imgUrl', val)}
        validate={v =>
          validURlPattern.test(v) ? undefined : 'Image URL is invalid'
        }
      />

      <TextField
        name="imdbUrl"
        label="Imdb URL"
        value={movie.imdbUrl}
        required
        onChange={val => handleChange('imdbUrl', val)}
        validate={v =>
          validURlPattern.test(v) ? undefined : 'Imdb URL is invalid'
        }
      />

      <TextField
        name="imdbId"
        label="Imdb ID"
        value={movie.imdbId}
        required
        onChange={val => handleChange('imdbId', val)}
      />

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            data-cy="submit-button"
            className="button is-link"
            disabled={isSubmitDisabled}
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
