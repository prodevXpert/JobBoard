import Proptypes from "prop-types";
import axios from "axios";

export async function Get(payload, api_url, onSuccess, onError) {
  try {
    const response = await axios.get(api_url, { params: payload });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
}

Get.propTypes = {
  payload: Proptypes.object,
  api_url: Proptypes.string,
  onSuccess: Proptypes.func,
  onError: Proptypes.func,
};

export async function Post(payload, api_url, onSuccess, onError) {
  try {
    const response = await axios.post(api_url, payload);
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
}

Post.propTypes = {
  payload: Proptypes.object,
  api_url: Proptypes.string,
  onSuccess: Proptypes.func,
  onError: Proptypes.func,
};

export async function Put(payload, api_url, onSuccess, onError) {
  try {
    const response = await axios.put(api_url, payload);
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
}

Put.propTypes = {
  payload: Proptypes.object,
  api_url: Proptypes.string,
  onSuccess: Proptypes.func,
  onError: Proptypes.func,
};

export async function Delete(payload, api_url, onSuccess, onError) {
  try {
    const response = await axios.delete(api_url, { data: payload });
    onSuccess(response.data);
  } catch (error) {
    onError(error);
  }
}

Delete.propTypes = {
  payload: Proptypes.object,
  api_url: Proptypes.string,
  onSuccess: Proptypes.func,
  onError: Proptypes.func,
};
