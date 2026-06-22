import TransactionController from './TransactionController'
import AttendanceController from './AttendanceController'
import DashboardController from './DashboardController'
import SuperAdminController from './SuperAdminController'
import CustomerController from './CustomerController'
import ProductController from './ProductController'
import CategoryController from './CategoryController'
import TableController from './TableController'
import MaterialController from './MaterialController'
import StaffController from './StaffController'
import ShiftController from './ShiftController'
import Settings from './Settings'
const Controllers = {
    TransactionController: Object.assign(TransactionController, TransactionController),
AttendanceController: Object.assign(AttendanceController, AttendanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
SuperAdminController: Object.assign(SuperAdminController, SuperAdminController),
CustomerController: Object.assign(CustomerController, CustomerController),
ProductController: Object.assign(ProductController, ProductController),
CategoryController: Object.assign(CategoryController, CategoryController),
TableController: Object.assign(TableController, TableController),
MaterialController: Object.assign(MaterialController, MaterialController),
StaffController: Object.assign(StaffController, StaffController),
ShiftController: Object.assign(ShiftController, ShiftController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers