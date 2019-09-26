class TestSSO {
    server = "cwx1xic2dl.database.windows.net";
    protocol = "tcp";
    port = 1433;
    database = "certificate";
    userID = "mrmediaroom@cwx1xic2dl";
    password = "Esoteric$";
    trustedConnection = false;
    encrypt = true;
    connectionTimeout = 30000

    constructor() { }
}

export default new TestSSO();