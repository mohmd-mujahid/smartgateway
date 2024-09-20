# Rmobic
Rombic is a centralized API Gateway to manage API connectivity with any service providers in variant data format. It supports JSON, SOAP, and XML service connectivity. In addition, SQL Query execution in database platforms including MySQL and MS SQL Server.

# How to Run
- Install NodeJS
- Extract node_modules.zip into the parent folder of the project
- Import Database backup gateway.sql to your Database paltform
- Run startup.bat file to start the service or run it as a system service.
- 

# Rombic Database Connection 
- Rombic is implemented to work with the MS SQL Server and MySql platforms.
- To Include a new database platform install the suitable module using (npm install) command.

# Main features 
- Support SOAP API connectivity and convert response to JSON format.
- Support connection with database platforms (MySQL and MS SQL Server) and execute any SQL queries, also format results of query execution to JSON.
- Provide real-time logging to track transaction flow.
- Logging transactions flow into a dedicated log file (path logs/outputLog.log)
- Store transaction logs in the system database.


# Read the Manual of Using
- Checkout Smart Gateway.pdf 
