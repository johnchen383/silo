import axios from "axios"

const BASE_URL = "https://bible.helloao.org"

export const GetBSB = async <T>(url: string): Promise<T> => {
    const response = await axios.get<T>(`${BASE_URL}${url}`);

    if (response.status !== 200) {
        alert(`Unable to send GET request to: ${url}`);
    }

    return response.data;
};

