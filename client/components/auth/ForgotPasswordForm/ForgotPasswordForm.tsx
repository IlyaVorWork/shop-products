import React, {
  createRef,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { Button, Input } from '@ui/index'
import {
  IForgotPasswordProps,
  IForgotPasswordMutationProps,
  IForgotProps,
} from '@interfaces/auth'
import { AppContext } from '@providers/AppProvider'
import FORGOT_PASSWORD from '@graphql/mutations/ForgotPassword'
import { errorMessage } from '@utils/errorMessage'
import { forgotPasswordUser } from '@utils/auth'
import { useSnackbar } from 'notistack'

import { useStyles } from './ForgotPasswordForm.styles'
import clsx from 'clsx'

const ForgotPasswordForm: FunctionComponent<IForgotProps> = ({
  setEmailData,
  setFormikEmailData,
}) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { state, dispatch } = useContext(AppContext)
  const [forgotPassword] = useMutation<IForgotPasswordMutationProps>(
    FORGOT_PASSWORD
  )
  const recaptchaRef = createRef<any>()

  const [captchaToken, setCaptchaToken] = useState<string>(
    '03AGdBq27y0lbhiA27ln-c6sbilJ8yHR-BMK2XtKBy06pFhoMb-1Db2L1m7PC4apQg5OtMwP_7j2ji1dEBpDA92K6fXZ5iCN7bJFKOotbikOmt1GISnIRizlf4dk4TN9sachmxeqHUdqeyDEKS1aIVTed2TNQj7Hz5tkDeFKkj3d8VuLuJWLhC5u1gpi_xQbz9pHE2PL2621P2paXbnHyRmE_ReaqbNjqnH3kSzXY9G2QjAoILyc0P8WNTqNyZ5Mcn2tfeJAgvhp1P32qq_f0Pt9Ftvu8dSHbzTDKLmsW5zP_xovUkuQpamGhSxYlCwmiGUV0I309Igp-PfNVkXzwmXJvtU-pilyvXbOCfBTKfCPyF8sHQm4CRCgc9xb4m4VkoCgyOLfvyyMg0guBeTP52hOOmKhYb1pqKRj64J6pY1mMYEvVCIW8yNxYKRYjuJWhVW5YNY5Z4XbbR'
  )

  const initialValues: IForgotPasswordProps = {
    email: '',
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Введите корректный email')
      .required('Email обязателен для заполнения'),
  })

  const handleSubmit = useCallback(async (values: IForgotPasswordProps) => {
    console.log(captchaToken, 'captcha token в handleSubmit')
    if (captchaToken.length) {
      try {
        const data = await forgotPasswordUser(dispatch, forgotPassword, values)
        if (!data.ok) {
          enqueueSnackbar(errorMessage(data), {
            variant: 'error',
          })
        } else {
          setEmailData(data.ok)
          setFormikEmailData(values.email)
        }
      } catch (error) {
        enqueueSnackbar(errorMessage(error), {
          variant: 'error',
        })
      }
    } else {
      enqueueSnackbar('Введите капчу', {
        variant: 'error',
      })
    }
  }, [])

  const handleCaptcha = (value) => {
    setCaptchaToken(value)
    console.log(value, 'value в handleCaptcha')
    console.log(captchaToken, 'captcha token в handleCaptcha')
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnMount: true,
  })

  console.log(captchaToken, 'captcha token в компоненте')
  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        id="email"
        type="email"
        label="Введите email"
        name="email"
        variant="outlined"
        fullWidth
        className={
          formik.touched.email && Boolean(formik.errors.email)
            ? clsx(classes.input, classes.input_error)
            : classes.input
        }
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email ? formik.errors.email : undefined}
      />
      <ReCAPTCHA
        ref={recaptchaRef}
        onChange={handleCaptcha}
        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SECRET_KEY}
        className={classes.input}
      />
      <Button
        type="submit"
        disabled={state.loading && !formik.isValid}
        fullWidth
        className={classes.button}
      >
        {!state.loading ? 'Восстановить доступ' : 'Загрузка'}
      </Button>
    </form>
  )
}

export default ForgotPasswordForm
