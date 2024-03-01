async function fetchData(protocol: string, host: string, path: string, body: any = null, file?: FormData) {
    const options: any = {
        method: protocol,
    };

    if (file instanceof FormData) {
        options.body = file;
    }else if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    /* Logging the request details for debugging purposes
    console.error(`Request URL: ${host}${path}`);
    console.error(`Method: ${options.method}`);
    if (options.body instanceof FormData) {
        options.body.forEach((value: any, key: string) => {
            if (typeof value === 'object' && 'name' in value) {
                // Assuming the object with a 'name' property is a File, log its details.
                console.error(`${key}: File - name: ${value['name']}, size: ${value.size} bytes, type: ${value.type}`);
            } else {
                // For other types of values (likely strings), log them directly.
                console.error(`${key}: ${value}`);
            }
        });
    }
    */

    let data;
    try {
        let response = await fetch(`${host}${path}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}`);
        }

        data = await response.json();
    } catch (error) {
        if (host !== "http://localhost:8000") {
            console.error('There was a problem with the fetch operation: ', error);
        }

        if (host === "http://localhost:8000") {
            try {
                host = "http://127.0.0.1:8000";
                let response = await fetch(`${host}${path}`, options);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}`);
                }

                data = await response.json();
            } catch (error) {
                console.error('There was a problem with the fetch operation: ', error);
                throw error;
            }
        } else {
            throw error;
        }
    }

    return data;
}

export default fetchData;