<template>
  <div>
    <div id="tableMoveList">
      <table>
        <tr class="headerLayer">
          <th>Move #</th>
          <th>Player</th>
          <th>Move</th>
        </tr>

        <tr class="bodyLayer" v-for="(position, index) in positionMoveList" v-if="index != 0" :key="index">
          <td> {{ index }}</td>
          <td> {{ position.color }}</td>
          <td> {{ position.move[0] }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MoveList',
    data() {
      return {
      }
    },
    props: {
      positionMoveList: Array,
    },
    methods: {
      updateCurrentPlayerDisplayed() {
        let arrayLength = this.positionMoveList.length;
        if (arrayLength == 0) {
          return 'White';
        }
        else if (this.positionMoveList[arrayLength - 1].color == 'White') {
          return 'Black';
        }
        else {
          return 'White';
        }
      },
    },
  }
</script>

<style scoped>
  table {
    border-collapse: separate;
    border-spacing: 0;
    margin:  auto;
  }

  th, td {
    text-align: center;
    padding: 15px;
    font-size: 20px;
    border-bottom: 2px solid lightgray;
  }

  th {
    background: coral;
    color: white;
  }

  tr:hover {
    background-color: lightgray;
    font-weight: bold;
    color: white;
  }

  table tr:first-child th:first-child {
    border-top-left-radius: 8px;
    padding-left: 30px;
  }

  table tr:first-child th:last-child {
    border-top-right-radius: 8px;
    padding-right: 30px;
  }

  table tr:last-child td {
    border: none;
  }

</style>
