import Toast from "react-native-toast-message";
import CustomToast from "../components/UI/CustomToast";

export const toastConfig = {
    error: ({ props }) => (
      <CustomToast error={props.error || { main: 'Error', sub: '' }} type={"error"}/>
    ),
    success: ({ props }) => (
      <CustomToast error={props.message || { main: 'Success', sub: '' }} type={"success"}/>
    )
};

export function showError(error) {
    Toast.show({
        type: 'error',
        props: { error: error }
    });
}

export function showSuccess(message) {
    Toast.show({
        type: 'success',
        props: { message: message }
    });
}