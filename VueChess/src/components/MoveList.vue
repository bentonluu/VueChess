<template>
  <div>
    <div id="tableMoveList">
      <table>
        <tr>
          <th>Move #</th>
          <th>Player</th>
          <th>Move</th>
        </tr>

        <tr v-for="(position, index) in positionMoveList" v-if="index != 0" :key="index">
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
  table, th, td {
    border: 2px solid black;
    text-align: center;
    padding: 10px;
    font-size: 20px;
  }

  table {
    border-collapse: collapse;
    margin: 0 auto;
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
</style>
