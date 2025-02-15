const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) throw new Error("User not found");
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error("Incorrect password");
            
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user };
        },
        getAllEmployees: async () => await Employee.find(),
        getEmployeeById: async (_, { eid }) => await Employee.findById(eid),
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            return await Employee.find({ $or: [{ designation }, { department }] });
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            return await user.save();
        },
        addEmployee: async (_, args) => {
            const employee = new Employee(args);
            return await employee.save();
        },
        updateEmployee: async (_, { eid, ...updates }) => {
            return await Employee.findByIdAndUpdate(eid, updates, { new: true });
        },
        deleteEmployee: async (_, { eid }) => {
            await Employee.findByIdAndDelete(eid);
            return "Employee deleted successfully";
        }
    }
};

module.exports = resolvers;

