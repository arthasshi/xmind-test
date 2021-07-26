<template>
  <div class="home">
    <div class="menus">
      <div class="filter">
        <el-date-picker
          v-model="selMonth"
          value-format="timestamp"
          type="month"
          placeholder="选择月份"
          @change="selMonthHandler"
        >
        </el-date-picker>
        <el-button type="primary" @click="resetSelMoth">重置</el-button>

        <div>所选月份：总支出{{ totalPay }}/总收入{{ totalIncome }}</div>
      </div>
      <el-button type="primary" @click="addDialogVisible = true"
        >添加新账单</el-button
      >
    </div>
    <div class="bill">
      <el-table :data="currBillData" style="width: 100%">
        <el-table-column
          prop="time"
          label="时间"
          width="180"
          :sortable="true"
          :formatter="timeFilter"
        >
        </el-table-column>
        <el-table-column
          prop="category"
          label="类型"
          width="180"
          :formatter="cateFilter"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          width="180"
          label="分类"
          :formatter="typeFilter"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          width="180"
          label="金额"
          :sortable="true"
          :sort-method="sortByAmount"
        >
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增数据弹窗 -->
    <el-dialog title="新增账单" :visible.sync="addDialogVisible">
      <el-form :model="addObj">
        <el-form-item label="账单分类" :label-width="formLabelWidth">
          <el-select v-model="addObj.category" placeholder="请选择分类">
            <el-option
              v-for="i in categoryData"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单类型" :label-width="formLabelWidth">
          <el-radio v-model="addObj.type" label="1">收入</el-radio>
          <el-radio v-model="addObj.type" label="0">支出</el-radio>
        </el-form-item>
        <el-form-item label="账单金额" :label-width="formLabelWidth">
          <el-input v-model="addObj.amount" placeholder="请输入金额"></el-input>
        </el-form-item>
        <el-form-item label="账单时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addObj.time"
            type="date"
            value-format="timestamp"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add2List">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import bill from "../assets/data/bill.csv";
import categories from "../assets/data/categories.csv";
export default {
  name: "home",
  components: {},
  data() {
    return {
      billData: [], //原始账单数据
      categoryData: [], //消费类型数据
      currBillData: [], //展示在页面中的账单数据，一般情况下是billData的子集
      totalPay: 0, //筛选时用到的 总支出
      totalIncome: 0, //筛选时用到的 总收入
      selMonth: "", //月份选择
      addObj: {}, //新增数据
      addDialogVisible: false, //新增弹窗显示活隐藏
      formLabelWidth: "120px"
    };
  },
  mounted() {
    // this.billData = bill;
    // this.categoryData = categories;
    this.billData = this.arr2Data(bill);
    this.categoryData = this.arr2Data(categories);
    this.currBillData = this.billData;
  },
  methods: {
    // csv的二维数组 转化成我们需要的对象数组
    arr2Data(arr) {
      let data = [];
      if (!(arr.constructor == Array) && arr.length > 0) {
        return "need an array";
      }
      let props = arr.shift(); //去除表头,并保存表头
      let len = arr.length; //新的数组长度
      for (let j = 0; j < len; j++) {
        let obj = {};
        for (let k = 0; k < arr[j].length; k++) {
          obj[props[k]] = arr[j][k];
        }
        data.push(obj);
      }
      return data;
    },
    //月份选择
    selMonthHandler() {
      this.totalPay = 0;
      this.totalIncome = 0;
      //得到选择的月份的最后一刻的时间戳
      let cTime = new Date(this.selMonth);
      let year = cTime.getFullYear();
      let month = parseInt(cTime.getMonth() + 1);
      if (month == 12) {
        month = 0;
        year += 1;
      }
      let end = new Date(year + "-" + (month + 1) + "-01 00:00:00").getTime();
      let start = this.selMonth; //月份开始的时间戳
      this.currBillData = this.billData.filter(e => {
        let timestemp = parseInt(e.time);
        if (timestemp > start && timestemp < end) {
          if (e.type == "1") {
            this.totalIncome += parseInt(e.amount);
          } else if (e.type == "0") {
            this.totalPay += parseInt(e.amount);
          }
          return true;
        } else {
          return false;
        }
      });
    },
    //新增
    add2List() {
      this.billData.unshift(this.addObj);
      this.currBillData = this.billData;
      this.addDialogVisible = false;
    },
    //重置
    resetSelMoth() {
      this.selMonth = "";
      this.currBillData = this.billData;
      this.totalPay = 0;
      this.totalIncome = 0;
    },
    // 金额排序
    sortByAmount(sec, first) {
      return parseInt(sec.amount) - parseInt(first.amount);
    },

    //类型转化
    cateFilter(row) {
      let nameStr = "";
      let len = this.categoryData.length;

      for (let i = 0; i < len; i++) {
        if (row.category == this.categoryData[i].id) {
          nameStr = this.categoryData[i].name;
        }
      }
      return nameStr;
    },
    //type转化
    typeFilter(row) {
      return row.type == "1" ? "收入" : "支出";
    },
    //time转化
    timeFilter(row) {
      return new Date(parseInt(row.time))
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  .menus {
    width: 80%;
    @extend %row;
    justify-content: space-between;
    border-bottom: 2px solid #f2f2f2;
    padding-bottom: 20px;
    .filter {
      @extend %row;
      width: 60%;
      justify-content: space-around;
    }
  }
}
</style>
